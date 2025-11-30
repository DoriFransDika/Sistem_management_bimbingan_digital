<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Schedule;
use App\Models\Meeting;
use App\Models\Rating;
use App\Models\MemberProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MemberDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $memberId = $user->id_user;
        
        // Get member profile data with relationships
        $memberProfile = MemberProfile::where('user_id', $memberId)
            ->with('specialization')
            ->first();
        
        // Get member profile data
        $memberData = [
            'id' => $user->id_user,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $memberProfile ? $memberProfile->phone : null,
            'training_type' => $memberProfile && $memberProfile->specialization ? $memberProfile->specialization->name : 'Administrasi Perkantoran',
            'remaining_sessions' => $memberProfile ? $memberProfile->remaining_sessions : 0,
        ];

        // Get member statistics
        $memberStats = $this->getMemberStats($memberId);

        // Get nearest upcoming schedule
        $nearestSchedule = $this->getNearestSchedule($memberId);

        // Get last review
        $lastReview = $this->getLastReview($memberId);

        return Inertia::render('Dashboard/MemberDashboard', [
            'auth' => [
                'user' => $user
            ],
            'memberData' => $memberData,
            'memberStats' => $memberStats,
            'nearestSchedule' => $nearestSchedule,
            'lastReview' => $lastReview,
        ]);
    }

    private function getMemberStats($memberId)
    {
        // Get member profile for remaining sessions and training type
        $memberProfile = MemberProfile::where('user_id', $memberId)->with('specialization')->first();
        
        // Count upcoming confirmed schedules from schedules table
        $upcomingSessions = Schedule::where('member_id', $memberId)
            ->whereIn('status', ['confirmed', 'approved'])
            ->where('proposed_date', '>=', Carbon::today())
            ->count();

        // Count completed schedules from schedules table
        $completedSchedules = Schedule::where('member_id', $memberId)
            ->where('status', 'completed')
            ->count();

        // Get remaining sessions from member profile
        $remainingSessions = $memberProfile ? $memberProfile->remaining_sessions : 0;

        return [
            'remainingSessions' => max(0, $remainingSessions), // Ensure not negative
            'upcomingSessions' => $upcomingSessions,
            'trainingType' => $memberProfile && $memberProfile->specialization ? $memberProfile->specialization->name : 'Administrasi Perkantoran',
        ];
    }

    private function getNearestSchedule($memberId)
    {
        // Get member profile to get meeting type
        $memberProfile = MemberProfile::where('user_id', $memberId)->first();
        
        $schedule = Schedule::where('member_id', $memberId)
            ->whereIn('status', ['confirmed', 'approved'])
            ->where('proposed_date', '>=', Carbon::today())
            ->with([
                'mentor:id_user,name,email',
                'specialization:Id_specializations,name'
            ])
            ->orderBy('proposed_date', 'asc')
            ->orderBy('proposed_time', 'asc')
            ->first();

        if (!$schedule) {
            return null;
        }

        // Get meeting type from member profile
        $meetingType = $memberProfile ? ($memberProfile->delivery_mode ?? 'Luring') : 'Luring';
        // Convert to lowercase for component compatibility
        $meetingTypeLower = strtolower($meetingType) === 'daring' ? 'daring' : 'luring';

        return [
            'id' => $schedule->Id_schedles,
            'mentor_name' => $schedule->mentor ? $schedule->mentor->name : 'Mentor',
            'scheduled_date' => $schedule->proposed_date,
            'scheduled_time' => $schedule->proposed_time ?? '10:00',
            'meeting_type' => $meetingTypeLower,
            'status' => $schedule->status,
            'training_type' => $schedule->specialization?->name,
        ];
    }

    private function getLastReview($memberId)
    {
        $review = Rating::where('member_id', $memberId)
            ->with(['mentor:id_user,name'])
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$review) {
            return null;
        }

        return [
            'id' => $review->id,
            'comment' => $review->review,
            'rating' => $review->rating,
            'mentor_name' => $review->mentor ? $review->mentor->name : 'Mentor',
            'created_at' => $review->created_at,
        ];
    }

    public function getStats(Request $request)
    {
        $user = $request->user();
        $stats = $this->getMemberStats($user->id_user);
        
        return response()->json($stats);
    }

    public function getNearestScheduleData(Request $request)
    {
        $user = $request->user();
        $schedule = $this->getNearestSchedule($user->id_user);
        
        return response()->json($schedule);
    }

    public function getLastReviewData(Request $request)
    {
        $user = $request->user();
        $review = $this->getLastReview($user->id_user);
        
        return response()->json($review);
    }
}