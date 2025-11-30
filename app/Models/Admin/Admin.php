<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Admin extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'last_login_at'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get dashboard statistics
     */
    public static function getDashboardStats()
    {
        return [
            'totalMember' => \App\Models\User::where('role', 'member')->count(),
            'totalMentor' => \App\Models\User::where('role', 'mentor')->count(),
            'pertemuanMenunggu' => \App\Models\Meeting::where('status', 'pending')->count(),
            'laporanMenunggu' => \App\Models\Report::where('status', 'pending')->count(),
        ];
    }

    /**
     * Get recent activities
     */
    public static function getRecentActivities($limit = 10)
    {
        $activities = collect();

        // Get recent mentor confirmations
        $recentMentorConfirmations = \App\Models\Meeting::with(['mentor', 'member'])
            ->where('status', 'confirmed')
            ->where('updated_at', '>=', Carbon::now()->subDays(7))
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($meeting) {
                return [
                    'id' => $meeting->id,
                    'type' => 'mentor',
                    'message' => "Mentor {$meeting->mentor->name} mengonfirmasi jadwal dengan {$meeting->member->name}.",
                    'time' => $meeting->updated_at->diffForHumans(),
                    'created_at' => $meeting->updated_at
                ];
            });

        // Get recent approved reports
        $recentReports = \App\Models\Report::with(['user'])
            ->where('status', 'approved')
            ->where('updated_at', '>=', Carbon::now()->subDays(7))
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'type' => 'report',
                    'message' => "Laporan sesi untuk {$report->user->name} telah disetujui.",
                    'time' => $report->updated_at->diffForHumans(),
                    'created_at' => $report->updated_at
                ];
            });

        // Get new users
        $newUsers = \App\Models\User::where('created_at', '>=', Carbon::now()->subDays(7))
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

        // Combine and sort activities
        $activities = $activities
            ->merge($recentMentorConfirmations)
            ->merge($recentReports)
            ->merge($newUsers)
            ->sortByDesc('created_at')
            ->take($limit)
            ->values();

        return $activities;
    }

    /**
     * Get meetings data for chart
     */
    public static function getMeetingsData()
    {
        return [
            'completed' => \App\Models\Meeting::where('status', 'completed')->count(),
            'registered' => \App\Models\Meeting::where('status', 'registered')->count(),
            'ongoing' => \App\Models\Meeting::where('status', 'ongoing')->count(),
        ];
    }

    /**
     * Get real-time dashboard data
     */
    public static function getRealTimeData()
    {
        return [
            'stats' => self::getDashboardStats(),
            'activities' => self::getRecentActivities(),
            'meetings' => self::getMeetingsData(),
            'last_updated' => Carbon::now()->toISOString()
        ];
    }

    /**
     * Activity logs relationship
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(\App\Models\ActivityLog::class);
    }

    /**
     * Create activity log
     */
    public function logActivity($action, $description, $model = null)
    {
        return $this->activityLogs()->create([
            'action' => $action,
            'description' => $description,
            'model_type' => $model ? get_class($model) : null,
            'model_id' => $model ? $model->id : null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);
    }
}