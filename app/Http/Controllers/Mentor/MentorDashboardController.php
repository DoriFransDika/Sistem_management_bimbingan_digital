<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Rating;
use App\Models\MemberProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MentorDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $mentorId = $user->id_user;
        
        // Get mentor profile data
        $mentorData = [
            'id' => $mentorId,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->mentorProfile ? $user->mentorProfile->phone : null,
            'specialization' => optional(optional($user->mentorProfile)->specialization)->name,
            'day' => optional(optional($user->mentorProfile)->day)->name,
        ];

        // Get performance statistics
        $performanceStats = $this->getPerformanceStats($mentorId);

        // Get upcoming confirmed schedules
        $upcomingSchedules = $this->getUpcomingSchedules($mentorId);

        return Inertia::render('Dashboard/MentorDashboard', [
            'auth' => [
                'user' => $user,
            ],
            'mentorData' => $mentorData,
            'performanceStats' => $performanceStats,
            'upcomingSchedules' => $upcomingSchedules,
        ]);
    }

    private function getPerformanceStats($mentorId)
    {
        // Total sessions completed from schedules table
        $totalSessionsCompleted = Schedule::where('mentor_id', $mentorId)
            ->where('status', 'completed')
            ->count();

        // Pending requests from schedules table
        $pendingRequests = Schedule::where('mentor_id', $mentorId)
            ->where('status', 'pending_approval')
            ->count();

        // Average rating from ratings table
        $averageRating = Rating::where('mentor_id', $mentorId)
            ->avg('rating');

        return [
            'totalSessionsCompleted' => $totalSessionsCompleted,
            'pendingRequests' => $pendingRequests,
            'averageRating' => $averageRating ? round($averageRating, 1) : 0.0,
        ];
    }

    private function getUpcomingSchedules($mentorId)
    {
        $schedules = Schedule::where('mentor_id', $mentorId)
            ->where('status', 'confirmed')
            ->where('proposed_date', '>=', Carbon::today())
            ->with([
                'member' => function ($query) {
                    $query->select('id_user', 'name', 'email');
                },
                'specialization:Id_specializations,name'
            ])
            ->orderBy('proposed_date', 'asc')
            ->limit(5)
            ->get();

        return $schedules->map(function ($schedule) {
            // Ambil jenis pertemuan dari member profile (jika ada)
            $meetingType = MemberProfile::where('user_id', $schedule->member_id)->value('delivery_mode') ?? 'Luring';
            $meetingTypeLower = strtolower($meetingType) === 'daring' ? 'daring' : 'luring';

            return [
                'id' => $schedule->Id_schedles,
                'member_name' => $schedule->member ? $schedule->member->name : 'Unknown Member',
                'scheduled_date' => $schedule->proposed_date,
                'scheduled_time' => $schedule->proposed_time ?? '10:00',
                'meeting_type' => $meetingTypeLower,
                'status' => $schedule->status,
                'training_type' => $schedule->specialization?->name,
            ];
        });
    }

    public function getStats(Request $request)
    {
        $user = $request->user();
        $stats = $this->getPerformanceStats($user->id_user);
        
        return response()->json($stats);
    }

    public function getUpcomingSchedulesData(Request $request)
    {
        $user = $request->user();
        $schedules = $this->getUpcomingSchedules($user->id_user);
        
        return response()->json($schedules);
    }
}
