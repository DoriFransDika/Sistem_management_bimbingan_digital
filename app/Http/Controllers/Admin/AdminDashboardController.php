<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MemberProfile;
use App\Models\MentorProfile;
use App\Models\Schedule;
use App\Models\Meeting;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // 1. Total Member - hitung dari tabel member_profiles
        $totalMember = MemberProfile::count();

        // 2. Total Mentor - hitung dari tabel mentor_profiles
        $totalMentor = MentorProfile::count();

        // 3. Verifikasi Mentor - hitung dari tabel schedules yang menunggu verifikasi admin
        $verifikasiMentor = Schedule::where('status', 'pending_admin_verification')->count();

        // 4. Status Pertemuan - ambil semua status dari tabel meetings (BUKAN schedules)
        $statusPertemuan = Meeting::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // 5. Sesi Pembelajaran per Mentor - dari tabel meetings status completed
        $mentorSessions = User::where('role', 'mentor')
            ->withCount(['meetings as completed_meetings_count' => function ($query) {
                $query->where('status', 'completed');
            }])
            ->with('mentorProfile')
            ->having('completed_meetings_count', '>', 0)
            ->orderBy('completed_meetings_count', 'desc')
            ->get()
            ->map(function ($mentor) {
                return [
                    'id' => $mentor->id,
                    'name' => $mentor->name,
                    'completed_meetings_count' => $mentor->completed_meetings_count,
                ];
            });

        // 6. Ulasan dan Rating - dari tabel rating
        $reviews = Rating::with(['member.memberProfile.specialization', 'mentor'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($rating) {
                // Safe navigation untuk menghindari null error
                $memberName = $rating->member->name ?? 'Unknown';
                $mentorName = $rating->mentor->name ?? 'Unknown';
                $trainingType = 'N/A';
                
                // Cek apakah member profile dan specialization ada
                if ($rating->member && $rating->member->memberProfile && $rating->member->memberProfile->specialization) {
                    $trainingType = $rating->member->memberProfile->specialization->name;
                }
                
                return [
                    'id' => $rating->id,
                    'member_name' => $memberName,
                    'mentor_name' => $mentorName,
                    'rating' => (int) $rating->rating, // Ensure rating is integer for consistent filtering
                    'comment' => $rating->review ?? '',
                    'created_at' => $rating->created_at->diffForHumans(),
                    'training_type' => $trainingType,
                ];
            });

        // Mentor ratings untuk ranking
        $mentorRatings = User::where('role', 'mentor')
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->having('ratings_count', '>', 0)
            ->orderBy('ratings_avg_rating', 'desc')
            ->get()
            ->map(function ($mentor) {
                return [
                    'id' => $mentor->id,
                    'name' => $mentor->name,
                    'average_rating' => round($mentor->ratings_avg_rating ?? 0, 1),
                    'ratings_count' => $mentor->ratings_count,
                ];
            });

        // Data untuk pie chart - format sesuai kebutuhan frontend
        // Mapping status dari tabel meetings (completed, ongoing, pending, confirmed, cancelled)
        $meetingsData = [
            'selesai' => $statusPertemuan['completed'] ?? 0,
            'terdaftar' => $statusPertemuan['pending'] ?? 0,
            'berlangsung' => ($statusPertemuan['ongoing'] ?? 0) + ($statusPertemuan['confirmed'] ?? 0),
        ];

        return Inertia::render('Dashboard/AdminDashboard', [
            'stats' => [
                'totalMember' => $totalMember,
                'totalMentor' => $totalMentor,
                'verifikasiMentor' => $verifikasiMentor,
            ],
            'meetings' => $meetingsData,
            'mentors' => $mentorSessions,
            'reviews' => $reviews,
            'mentorRatings' => $mentorRatings,
        ]);
    }
}
