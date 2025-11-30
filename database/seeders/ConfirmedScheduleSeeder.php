<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Schedule;
use App\Models\User;

class ConfirmedScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first member and mentor
        $member = User::where('role', 'member')->first();
        $mentor = User::where('role', 'mentor')->first();

        if (!$member || !$mentor) {
            $this->command->error('No member or mentor found. Please run UserSeeder first.');
            return;
        }

        // Create test confirmed schedules
        $schedules = [
            [
                'member_id' => $member->id_user,
                'mentor_id' => $mentor->id_user,
                'Id_specializations' => 'S3',
                'proposed_date' => '2024-01-20',
                'proposed_time' => '10:00:00',
                'status' => 'confirmed'
            ],
            [
                'member_id' => $member->id_user,
                'mentor_id' => $mentor->id_user,
                'Id_specializations' => 'S3',
                'proposed_date' => '2024-01-22',
                'proposed_time' => '14:00:00',
                'status' => 'confirmed'
            ],
            [
                'member_id' => $member->id_user,
                'mentor_id' => $mentor->id_user,
                'Id_specializations' => 'S4',
                'proposed_date' => '2024-01-25',
                'proposed_time' => '09:00:00',
                'status' => 'confirmed'
            ]
        ];

        foreach ($schedules as $scheduleData) {
            Schedule::create($scheduleData);
        }

        $this->command->info('Test confirmed schedules created successfully!');
    }
}