<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Materi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $mentorId = $request->user()->id_user;
        
        // Get completed schedules for this mentor
        $schedules = Schedule::where('mentor_id', $mentorId)
            ->where('status', 'completed')
            ->with(['member' => function($query) {
                $query->select('id_user', 'name', 'email');
            }, 'specialization:Id_specializations,name'])
            ->orderBy('proposed_date', 'desc')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->Id_schedles,
                    'member' => $schedule->member,
                    'proposed_date' => $schedule->proposed_date,
                    'proposed_time' => $schedule->proposed_time,
                    'training_type' => $schedule->specialization?->name,
                    'materi_modul' => $schedule->materi_modul,
                    'materi_topik' => $schedule->materi_topik,
                    'materi_sub_topik' => $schedule->materi_sub_topik,
                    'laporan_dikirim_at' => $schedule->laporan_dikirim_at,
                ];
            });

        // Get all materi for dropdown
        $materi = Materi::select('modul', 'topik', 'sub_topik')
            ->orderBy('modul')
            ->orderBy('pertemuan')
            ->get();

        // Group materi by modul
        $materiByModul = $materi->groupBy('modul');

        return Inertia::render('Mentor/LaporanMentor', [
            'schedules' => $schedules,
            'materiByModul' => $materiByModul,
            'auth' => [
                'user' => $request->user()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'schedule_id' => 'required|string',
            'materi_modul' => 'required|string',
            'materi_topik' => 'required|string',
            'materi_sub_topik' => 'required|string',
            'dokumentasi' => 'nullable|string'
        ]);

        $mentorId = $request->user()->id_user;

        // Verify that the schedule belongs to this mentor
        $schedule = Schedule::where('Id_schedles', $request->schedule_id)
            ->where('mentor_id', $mentorId)
            ->where('status', 'completed')
            ->first();

        if (!$schedule) {
            return back()->withErrors(['error' => 'Jadwal tidak ditemukan atau tidak dapat diakses']);
        }

        // Update schedule with laporan data
        $schedule->update([
            'materi_modul' => $request->materi_modul,
            'materi_topik' => $request->materi_topik,
            'materi_sub_topik' => $request->materi_sub_topik,
            'dokumentasi' => $request->dokumentasi,
            'laporan_dikirim_at' => Carbon::now()
        ]);

        return redirect()->route('mentor.laporan')->with('success', 'Laporan berhasil dikirim!');
    }

    public function getTopikByModul(Request $request)
    {
        $modul = $request->input('modul');
        
        $topik = Materi::where('modul', $modul)
            ->select('topik')
            ->distinct()
            ->orderBy('topik')
            ->get();

        return response()->json($topik);
    }

    public function getSubTopikByTopik(Request $request)
    {
        $modul = $request->input('modul');
        $topik = $request->input('topik');
        
        $subTopik = Materi::where('modul', $modul)
            ->where('topik', $topik)
            ->select('sub_topik')
            ->distinct()
            ->orderBy('sub_topik')
            ->get();

        return response()->json($subTopik);
    }
}