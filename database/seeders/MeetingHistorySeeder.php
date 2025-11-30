<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Schedule;
use App\Models\MeetingHistory;

class MeetingHistorySeeder extends Seeder
{
    public function run(): void
    {
        $member = User::where('role', 'member')->first();
        $mentor = User::where('role', 'mentor')->first();

        if (! $member || ! $mentor) {
            return;
        }

        // Ambil 1 schedule apapun, bila tidak ada skip
        $schedule = Schedule::first();
        if (! $schedule) {
            return;
        }

        MeetingHistory::create([
            'schedule_id' => $schedule->Id_schedles,
            'member_id' => $member->id_user,
            'mentor_id' => $mentor->id_user,
            'training_type' => 'Web Programming Basic',
            'meeting_date' => now()->toDateString(),
            'meeting_time' => now()->format('H:i:s'),
            'meeting_type' => 'Daring',
            'notes' => 'Sesi berjalan baik.',
            'status' => 'completed',
        ]);
    }
}


