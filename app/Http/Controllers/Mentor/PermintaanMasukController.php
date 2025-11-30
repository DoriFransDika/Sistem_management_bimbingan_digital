<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Schedule;
use App\Models\MeetingHistory;
use App\Models\MemberProfile;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PermintaanMasukController extends Controller
{
    public function index(Request $request)
    {
        $mentorId = $request->user()->id_user;
        
        // Get pending requests for this mentor (status pending_approval)
        $pendingRequests = Schedule::where('mentor_id', $mentorId)
            ->where('status', 'pending_approval')
            ->with([
                'member' => function ($query) {
                    $query->select('id_user', 'name', 'email');
                },
                'specialization:Id_specializations,name',
            ])
            ->orderBy('proposed_date', 'asc')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->Id_schedles,
                    'member' => $schedule->member,
                    'proposed_date' => $schedule->proposed_date,
                    'proposed_time' => $schedule->proposed_time,
                    'training_type' => $schedule->specialization?->name,
                    'status' => $schedule->status,
                ];
            });

        // Get confirmed schedules for this mentor
        $confirmedSchedules = Schedule::where('mentor_id', $mentorId)
            ->where('status', 'confirmed')
            ->with([
                'member' => function ($query) {
                    $query->select('id_user', 'name', 'email');
                },
                'specialization:Id_specializations,name',
            ])
            ->orderBy('proposed_date', 'asc')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->Id_schedles,
                    'member' => $schedule->member,
                    'proposed_date' => $schedule->proposed_date,
                    'proposed_time' => $schedule->proposed_time,
                    'training_type' => $schedule->specialization?->name,
                    'status' => $schedule->status,
                ];
            });

        return Inertia::render('Mentor/PermintaanMasuk', [
            'pendingRequests' => $pendingRequests,
            'confirmedSchedules' => $confirmedSchedules,
            'auth' => [
                'user' => $request->user()
            ]
        ]);
    }

    public function accept(Request $request, $scheduleId)
    {
        $schedule = Schedule::where('Id_schedles', $scheduleId)
            ->where('mentor_id', $request->user()->id_user)
            ->where('status', 'pending_approval')
            ->first();

        if (!$schedule) {
            return back()->withErrors(['error' => 'Permintaan tidak ditemukan']);
        }

        // Update schedule status to approved
        $schedule->update([
            'status' => 'approved'
        ]);

        // Create notifications
        // Notification for member
        Notification::create([
            'user_id' => $schedule->member_id,
            'title' => 'Jadwal Diterima',
            'message' => "Jadwal Anda dengan mentor {$schedule->mentor->name} pada {$schedule->proposed_date} telah diterima.",
            'type' => 'schedule_approved',
            'read' => false
        ]);

        // Notification for admin
        $admin = User::where('role', 'admin')->first();
        if ($admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Jadwal Baru Dikonfirmasi',
                'message' => "Mentor {$schedule->mentor->name} telah menerima jadwal dengan member {$schedule->member->name} pada {$schedule->proposed_date}.",
                'type' => 'schedule_confirmed',
                'read' => false
            ]);
        }

        return redirect()->route('mentor.permintaan-masuk')->with('success', 'Permintaan berhasil diterima');
    }

    public function reject(Request $request, $scheduleId)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:500'
        ]);

        $schedule = Schedule::where('Id_schedles', $scheduleId)
            ->where('mentor_id', $request->user()->id_user)
            ->where('status', 'pending_approval')
            ->first();

        if (!$schedule) {
            return back()->withErrors(['error' => 'Permintaan tidak ditemukan']);
        }

        // Update schedule status to pending admin verification with reason
        $schedule->update([
            'status' => 'pending_admin_verification',
            'rejection_reason' => $request->rejection_reason
        ]);

        // Create notification for admin
        $admin = User::where('role', 'admin')->first();
        if ($admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Verifikasi Penolakan Diperlukan',
                'message' => "Mentor {$schedule->mentor->name} menolak jadwal dengan member {$schedule->member->name} pada {$schedule->proposed_date}. Alasan: {$request->rejection_reason}",
                'type' => 'rejection_verification_needed',
                'read' => false
            ]);
        }

        return redirect()->route('mentor.permintaan-masuk')->with('success', 'Permintaan ditolak dan dikirim ke admin untuk verifikasi');
    }

    public function markCompleted(Request $request, $scheduleId)
    {
        $schedule = Schedule::where('Id_schedles', $scheduleId)
            ->where('mentor_id', $request->user()->id_user)
            ->where('status', 'confirmed')
            ->first();

        if (!$schedule) {
            return back()->withErrors(['error' => 'Jadwal tidak ditemukan']);
        }

        // Tandai jadwal sebagai selesai di tabel schedules (tetap disimpan untuk laporan)
        $schedule->update([
            'status' => 'completed',
        ]);

        return redirect()->route('mentor.permintaan-masuk')->with('success', 'Jadwal berhasil ditandai selesai');
    }
}

