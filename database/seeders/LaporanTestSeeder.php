<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Schedule;
use App\Models\User;

class LaporanTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first mentor and some members
        $mentor = User::where('role', 'mentor')->first();
        $members = User::where('role', 'member')->get();

        if (!$mentor || $members->isEmpty()) {
            $this->command->error('No mentor or members found. Please run UserSeeder first.');
            return;
        }

        // Create test completed schedules for laporan
        $schedules = [
            [
                'member_id' => $members[0]->id_user,
                'mentor_id' => $mentor->id_user,
                'Id_specializations' => 'S3',
                'proposed_date' => '2024-01-10',
                'proposed_time' => '10:00:00',
                'status' => 'completed'
            ],
            [
                'member_id' => ($members[1]->id_user ?? $members[0]->id_user),
                'mentor_id' => $mentor->id_user,
                'Id_specializations' => 'S2',
                'proposed_date' => '2024-01-12',
                'proposed_time' => '14:00:00',
                'status' => 'completed'
            ],
            [
                'member_id' => ($members[2]->id_user ?? $members[0]->id_user),
                'mentor_id' => $mentor->id_user,
                'Id_specializations' => 'S4',
                'proposed_date' => '2024-01-15',
                'proposed_time' => '09:00:00',
                'status' => 'completed'
            ],
            [
                'member_id' => $members[0]->id_user,
                'mentor_id' => $mentor->id_user,
                'Id_specializations' => 'S1',
                'proposed_date' => '2024-01-18',
                'proposed_time' => '13:00:00',
                'status' => 'completed'
            ]
        ];

        foreach ($schedules as $scheduleData) {
            Schedule::create($scheduleData);
        }

        $this->command->info('Test laporan data created successfully!');
    }
}