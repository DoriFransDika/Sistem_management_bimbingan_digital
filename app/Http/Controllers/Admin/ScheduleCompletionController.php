<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Materi;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ScheduleCompletionController extends Controller
{
    /**
     * Mark schedule as completed with materi validation
     */
    public function markCompleted(Request $request, $scheduleId)
    {
        $request->validate([
            'materi_id' => 'required|string|exists:materi,id_materi',
            'dokumentasi' => 'nullable|string',
            'laporan_dikirim_at' => 'nullable|date'
        ]);

        $schedule = Schedule::findOrFail($scheduleId);
        
        // Validasi bahwa schedule sudah dalam status yang bisa di-complete
        if (!in_array($schedule->status, ['approved', 'confirmed'])) {
            throw ValidationException::withMessages([
                'status' => 'Schedule harus dalam status approved atau confirmed untuk bisa di-complete'
            ]);
        }

        // Ambil data materi
        $materi = Materi::findOrFail($request->materi_id);

        // Update schedule dengan materi dan status completed
        $schedule->update([
            'status' => 'completed',
            'materi_id' => $request->materi_id,
            'materi_modul' => $materi->modul,
            'materi_topik' => $materi->topik,
            'materi_sub_topik' => $materi->sub_topik,
            'dokumentasi' => $request->dokumentasi,
            'laporan_dikirim_at' => $request->laporan_dikirim_at ?? now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Schedule berhasil di-mark sebagai completed',
            'schedule' => $schedule->load(['materi', 'member', 'mentor'])
        ]);
    }

    /**
     * Get available materi for completion
     */
    public function getAvailableMateri(Request $request)
    {
        $materi = Materi::select('id_materi', 'modul', 'topik', 'sub_topik', 'pertemuan')
            ->orderBy('modul')
            ->orderBy('pertemuan')
            ->get();

        return response()->json($materi);
    }

    /**
     * Validate completed schedules - ensure no null materi data
     */
    public function validateCompletedSchedules()
    {
        $invalidSchedules = Schedule::where('status', 'completed')
            ->where(function($query) {
                $query->whereNull('materi_id')
                      ->orWhereNull('materi_modul')
                      ->orWhereNull('materi_topik')
                      ->orWhereNull('materi_sub_topik');
            })
            ->get();

        if ($invalidSchedules->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Ditemukan ' . $invalidSchedules->count() . ' schedule dengan status completed yang memiliki data materi tidak lengkap',
                'invalid_schedules' => $invalidSchedules->map(function($schedule) {
                    return [
                        'id' => $schedule->Id_schedles,
                        'status' => $schedule->status,
                        'materi_id' => $schedule->materi_id,
                        'materi_modul' => $schedule->materi_modul,
                        'materi_topik' => $schedule->materi_topik,
                        'materi_sub_topik' => $schedule->materi_sub_topik,
                    ];
                })
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Semua schedule dengan status completed memiliki data materi yang lengkap'
        ]);
    }

    /**
     * Fix completed schedules with missing materi data
     */
    public function fixCompletedSchedules(Request $request)
    {
        $request->validate([
            'default_materi_id' => 'required|string|exists:materi,id_materi'
        ]);

        $defaultMateri = Materi::findOrFail($request->default_materi_id);
        
        $fixedCount = Schedule::where('status', 'completed')
            ->where(function($query) {
                $query->whereNull('materi_id')
                      ->orWhereNull('materi_modul')
                      ->orWhereNull('materi_topik')
                      ->orWhereNull('materi_sub_topik');
            })
            ->update([
                'materi_id' => $defaultMateri->id_materi,
                'materi_modul' => $defaultMateri->modul,
                'materi_topik' => $defaultMateri->topik,
                'materi_sub_topik' => $defaultMateri->sub_topik,
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Berhasil memperbaiki ' . $fixedCount . ' schedule dengan data materi tidak lengkap',
            'fixed_count' => $fixedCount
        ]);
    }
}
