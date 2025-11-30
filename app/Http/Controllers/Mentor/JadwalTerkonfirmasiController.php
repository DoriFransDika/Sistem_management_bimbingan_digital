<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\MemberProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class JadwalTerkonfirmasiController extends Controller
{
    public function index(Request $request)
    {
        $mentorId = $request->user()->id_user;
        
        // Get all confirmed schedules for this mentor
        $schedules = Schedule::where('mentor_id', $mentorId)
            ->where('status', 'confirmed')
            ->with([
                'member' => function($query) {
                    $query->select('id_user', 'name', 'email');
                },
                'specialization' => function($query) {
                    $query->select('Id_specializations', 'name');
                }
            ])
            ->orderBy('proposed_date', 'asc')
            ->orderBy('proposed_time', 'asc')
            ->get()
            ->map(function($schedule) {
                // Get member profile for meeting type
                $memberProfile = MemberProfile::where('user_id', $schedule->member_id)->first();
                
                // Format time properly
                $proposedTime = $schedule->proposed_time;
                if ($proposedTime instanceof Carbon) {
                    $proposedTime = $proposedTime->format('H:i');
                } elseif (is_string($proposedTime) && strlen($proposedTime) > 5) {
                    // If it's a datetime string, extract time part
                    $proposedTime = Carbon::parse($proposedTime)->format('H:i');
                }
                
                return [
                    'id' => $schedule->Id_schedles,
                    'member' => $schedule->member ? [
                        'id' => $schedule->member->id_user,
                        'name' => $schedule->member->name,
                        'email' => $schedule->member->email,
                    ] : null,
                    'proposed_date' => $schedule->proposed_date,
                    'proposed_time' => $proposedTime,
                    'status' => $schedule->status,
                    'training_type' => $schedule->specialization ? $schedule->specialization->name : 'Administrasi Perkantoran',
                    'meeting_type' => $memberProfile ? ($memberProfile->delivery_mode ?? 'Luring') : 'Luring',
                ];
            });

        return Inertia::render('Mentor/JadwalTerkonfirmasi', [
            'schedules' => $schedules,
            'auth' => [
                'user' => $request->user()
            ]
        ]);
    }

    public function markCompleted(Request $request, $id)
    {
        $mentorId = $request->user()->id_user;
        
        $schedule = Schedule::where('Id_schedles', $id)
            ->where('mentor_id', $mentorId)
            ->where('status', 'confirmed')
            ->first();

        if (!$schedule) {
            return back()->withErrors(['error' => 'Jadwal tidak ditemukan']);
        }

        // Update status to completed
        $schedule->update([
            'status' => 'completed'
        ]);

        return redirect()->route('mentor.jadwal-terkonfirmasi')->with('success', 'Jadwal berhasil ditandai selesai dan dipindahkan ke halaman Kirim Laporan');
    }
}

