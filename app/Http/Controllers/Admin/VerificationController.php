<?php

// app/Http/Controllers/Admin/VerificationController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerificationController extends Controller
{
    // Menampilkan halaman Verifikasi Penolakan
    public function index(Request $request)
    {
        // Get schedules pending admin verification
        $pendingVerifications = Schedule::where('status', 'pending_admin_verification')
            ->with(['member:id_user,name,email', 'mentor:id_user,name,email'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/VerificationPage', [
            'pendingVerifications' => $pendingVerifications,
            'auth' => [
                'user' => $request->user()
            ]
        ]);
    }

    // Mengambil data penolakan untuk ditampilkan di halaman
    public function getRejections()
    {
        $rejections = Schedule::where('status', 'pending_admin_verification')
            ->with(['member:id_user,name', 'mentor:id_user,name']) // Eager loading untuk efisiensi
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($rejections);
    }

    // Fungsi saat admin MENYETUJUI penolakan mentor
    public function approveRejection(Request $request, $scheduleId)
    {
        $schedule = Schedule::findOrFail($scheduleId);
        
        if ($schedule->status !== 'pending_admin_verification') {
            return back()->withErrors(['error' => 'Jadwal tidak dalam status verifikasi admin']);
        }

        // Update status to rejected
        $schedule->update(['status' => 'rejected']);

        // Create notification for member
        Notification::create([
            'user_id' => $schedule->member_id,
            'title' => 'Jadwal Ditolak',
            'message' => "Jadwal Anda dengan mentor {$schedule->mentor->name} pada {$schedule->proposed_date} telah ditolak. Alasan: {$schedule->rejection_reason}",
            'type' => 'schedule_rejected',
            'read' => false
        ]);

        return redirect()->route('admin.verification')->with('success', 'Penolakan telah disetujui. Member telah diberitahu.');
    }

    // Fungsi saat admin MENOLAK penolakan mentor
    public function rejectRejection(Request $request, $scheduleId)
    {
        $schedule = Schedule::findOrFail($scheduleId);
        
        if ($schedule->status !== 'pending_admin_verification') {
            return back()->withErrors(['error' => 'Jadwal tidak dalam status verifikasi admin']);
        }

        // Status diubah menjadi 'pending_approval' dan alasan dihapus
        $schedule->update([
            'status' => 'pending_approval',
            'rejection_reason' => null
        ]);

        // Create notification for mentor
        Notification::create([
            'user_id' => $schedule->mentor_id,
            'title' => 'Penolakan Ditolak',
            'message' => "Penolakan Anda untuk jadwal dengan member {$schedule->member->name} telah ditolak admin. Silakan pertimbangkan kembali.",
            'type' => 'rejection_rejected',
            'read' => false
        ]);

        return redirect()->route('admin.verification')->with('success', 'Penolakan telah ditolak. Jadwal kembali ke mentor untuk persetujuan.');
    }
}