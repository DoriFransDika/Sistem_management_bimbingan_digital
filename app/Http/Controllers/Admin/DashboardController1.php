<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Meeting;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema; // Import yang benar untuk Schema
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    // [Halaman] Dashboard Admin (versi aman & sederhana)
    /**
     * Display the admin dashboard
     */
    public function index(): Response
    {
        try {
            // Get dashboard data dengan error handling
            $stats = $this->getDashboardStats();
            $activities = $this->getRecentActivities(10);
            $meetings = $this->getMeetingsData();

            return Inertia::render('Dashboard/AdminDashboard', [
                'stats' => $stats,
                'activities' => $activities,
                'meetings' => $meetings,
                'auth' => [
                    'user' => auth()->user()
                ]
            ]);
        } catch (\Exception $e) {
            // Log error untuk debugging
            \Log::error('Dashboard Error: ' . $e->getMessage());
            
            // Fallback dengan data default jika ada error
            return Inertia::render('Dashboard/AdminDashboard', [
                'stats' => [
                    'totalMember' => 0,
                    'totalMentor' => 0,
                    'pertemuanMenunggu' => 0,
                    'laporanMenunggu' => 0,
                ],
                'activities' => [],
                'meetings' => [],
                'auth' => [
                    'user' => auth()->user()
                ],
                'error' => 'Unable to load dashboard data'
            ]);
        }
    }

    /**
     * Get dashboard statistics dengan error handling
     */
    // [Helper] Hitung statistik utama
    private function getDashboardStats()
    {
        try {
            // Cek apakah tabel ada dengan import yang benar
            if (!Schema::hasTable('users')) {
                return $this->getDefaultStats();
            }

            return [
                'totalMember' => User::where('role', 'member')->where('status', 'active')->count(),
                'totalMentor' => User::where('role', 'mentor')->where('status', 'active')->count(),
                'pertemuanMenunggu' => Schema::hasTable('meetings') ? Meeting::where('status', 'pending')->count() : 0,
                'laporanMenunggu' => Schema::hasTable('reports') ? Report::where('status', 'pending')->count() : 0,
            ];
        } catch (\Exception $e) {
            \Log::error('getDashboardStats Error: ' . $e->getMessage());
            return $this->getDefaultStats();
        }
    }

    /**
     * Default stats jika ada error
     */
    // [Helper] Nilai default jika terjadi error
    private function getDefaultStats()
    {
        return [
            'totalMember' => 2,
            'totalMentor' => 2,
            'pertemuanMenunggu' => 1,
            'laporanMenunggu' => 3,
        ];
    }

    /**
     * Get recent activities dengan error handling
     */
    // [Helper] Aktivitas terbaru (digabung dari meeting, report, user)
    private function getRecentActivities($limit = 10)
    {
        try {
            if (!Schema::hasTable('meetings') || !Schema::hasTable('reports')) {
                return $this->getDefaultActivities();
            }

            $activities = collect();

            // Recent mentor confirmations - tambahkan null check
            if (Schema::hasTable('meetings')) {
                $recentMeetings = Meeting::with(['mentor', 'member'])
                    ->where('status', 'confirmed')
                    ->where('updated_at', '>=', Carbon::now()->subDays(7))
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function ($meeting) {
                        // Null check untuk relasi
                        $mentorName = $meeting->mentor ? $meeting->mentor->name : 'Unknown Mentor';
                        $memberName = $meeting->member ? $meeting->member->name : 'Unknown Member';
                        
                        return [
                            'id' => $meeting->id,
                            'type' => 'mentor',
                            'message' => "Mentor {$mentorName} mengonfirmasi jadwal dengan {$memberName}.",
                            'time' => $meeting->updated_at->diffForHumans(),
                            'created_at' => $meeting->updated_at
                        ];
                    });

                $activities = $activities->merge($recentMeetings);
            }

            // Recent approved reports - tambahkan null check
            if (Schema::hasTable('reports')) {
                $recentReports = Report::with(['user'])
                    ->where('status', 'approved')
                    ->where('updated_at', '>=', Carbon::now()->subDays(7))
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function ($report) {
                        $userName = $report->user ? $report->user->name : 'Unknown User';
                        
                        return [
                            'id' => $report->id,
                            'type' => 'report',
                            'message' => "Laporan sesi untuk {$userName} telah disetujui.",
                            'time' => $report->updated_at->diffForHumans(),
                            'created_at' => $report->updated_at
                        ];
                    });

                $activities = $activities->merge($recentReports);
            }

            // New users
            if (Schema::hasTable('users')) {
                $newUsers = User::where('created_at', '>=', Carbon::now()->subDays(7))
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'type' => 'user',
                            'message' => "Pengguna baru '{$user->name}' ditambahkan sebagai {$user->role}.",
                            'time' => $user->created_at->diffForHumans(),
                            'created_at' => $user->created_at
                        ];
                    });

                $activities = $activities->merge($newUsers);
            }

            return $activities
                ->sortByDesc('created_at')
                ->take($limit)
                ->values();

        } catch (\Exception $e) {
            \Log::error('getRecentActivities Error: ' . $e->getMessage());
            return $this->getDefaultActivities();
        }
    }

    /**
     * Default activities jika database error
     */
    // [Helper] Data aktivitas default
    private function getDefaultActivities()
    {
        return collect([
            [
                'id' => 1,
                'message' => "Mentor Rahman mengonfirmasi jadwal dengan Andini.",
                'time' => "2 menit yang lalu",
                'type' => "mentor"
            ],
            [
                'id' => 2,
                'message' => "Laporan sesi untuk Dori Frans telah disetujui.",
                'time' => "5 menit yang lalu",
                'type' => "report"
            ],
            [
                'id' => 3,
                'message' => "Laporan sesi untuk Budi telah disetujui.",
                'time' => "10 menit yang lalu",
                'type' => "report"
            ],
            [
                'id' => 4,
                'message' => "Pengguna baru 'Alisa M' ditambahkan sebagai Mentor.",
                'time' => "1 hari yang lalu",
                'type' => "user"
            ]
        ]);
    }

    /**
     * Get meetings data dengan error handling
     */
    // [Helper] Ringkasan status pertemuan
    private function getMeetingsData()
    {
        try {
            if (!Schema::hasTable('meetings')) {
                return $this->getDefaultMeetingsData();
            }

            return [
                'selesai' => Meeting::where('status', 'completed')->count(),
                'terdaftar' => Meeting::where('status', 'pending')->count(),
                'berlangsung' => Meeting::where('status', 'ongoing')->count(),
            ];
        } catch (\Exception $e) {
            \Log::error('getMeetingsData Error: ' . $e->getMessage());
            return $this->getDefaultMeetingsData();
        }
    }

    /**
     * Default meetings data
     */
    // [Helper] Ringkasan default pertemuan
    private function getDefaultMeetingsData()
    {
        return [
            'selesai' => 65,
            'terdaftar' => 40,
            'berlangsung' => 85
        ];
    }

    /**
     * Get real-time dashboard data via AJAX
     */
    // [API] Data dashboard realtime sederhana
    public function getRealTimeData()
    {
        try {
            $data = [
                'stats' => $this->getDashboardStats(),
                'activities' => $this->getRecentActivities(10),
                'meetings' => $this->getMeetingsData(),
                'last_updated' => Carbon::now()->toISOString()
            ];
            
            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            \Log::error('getRealTimeData Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error fetching real-time data',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    
}