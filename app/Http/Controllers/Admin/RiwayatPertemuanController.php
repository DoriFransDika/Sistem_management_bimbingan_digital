<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Materi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiwayatPertemuanController extends Controller
{
    public function index(Request $request)
    {
        // Distinct specializations from schedules for filter options
        $trainingTypes = Schedule::query()
            ->join('specializations', 'schedules.Id_specializations', '=', 'specializations.Id_specializations')
            ->select('specializations.name')
            ->distinct()
            ->orderBy('specializations.name')
            ->pluck('specializations.name');

        return Inertia::render('Admin/RiwayatPertemuan', [
            'auth' => [
                'user' => $request->user()
            ],
            'trainingTypes' => $trainingTypes,
        ]);
    }

    public function getData(Request $request)
    {
        $perPage = (int) ($request->input('per_page') ?: 10);
        $trainingType = $request->input('training_type');

        $query = Schedule::query()
            ->with(['member:id_user,name', 'mentor:id_user,name', 'specialization:Id_specializations,name'])
            ->where('status', 'completed');

        if (!empty($trainingType)) {
            $query->whereHas('specialization', function ($q) use ($trainingType) {
                $q->where('name', $trainingType);
            });
        }

        // Order by most recent meeting
        $query->orderByDesc('proposed_date')->orderByDesc('proposed_time');

        $paginator = $query->paginate($perPage);

        // Map results and enrich with pertemuan (meeting number) from materi, if available
        $data = collect($paginator->items())->map(function (Schedule $schedule) {
            $pertemuan = null;
            if ($schedule->materi_modul && $schedule->materi_topik) {
                $materi = Materi::where('modul', $schedule->materi_modul)
                    ->where('topik', $schedule->materi_topik)
                    ->orderBy('pertemuan')
                    ->first();
                $pertemuan = $materi?->pertemuan;
            }

            return [
                'id' => $schedule->Id_schedles,
                'member_name' => $schedule->member?->name,
                'mentor_name' => $schedule->mentor?->name,
                'proposed_date' => $schedule->proposed_date,
                'proposed_time' => $schedule->proposed_time,
                'training_type' => $schedule->specialization?->name,
                'materi_modul' => $schedule->materi_modul,
                'materi_topik' => $schedule->materi_topik,
                'materi_sub_topik' => $schedule->materi_sub_topik,
                'pertemuan' => $pertemuan,
            ];
        });

        return response()->json([
            'data' => $data,
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }
}



















