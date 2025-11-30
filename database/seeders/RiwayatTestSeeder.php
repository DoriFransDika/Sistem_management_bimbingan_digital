<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Schedule;
use App\Models\User;

class RiwayatTestSeeder extends Seeder
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

        // Create test schedules for riwayat
        $schedules = [
            [
                'member_id' => $member->id,
                'mentor_id' => $mentor->id,
                'training_type' => 'Web Programming Basic',
                'proposed_date' => '2024-01-15',
                'proposed_time' => '10:00:00',
                'status' => 'completed'
            ],
            [
                'member_id' => $member->id,
                'mentor_id' => $mentor->id,
                'training_type' => 'Graphic Design',
                'proposed_date' => '2024-01-20',
                'proposed_time' => '14:00:00',
                'status' => 'rejected',
                'rejection_reason' => 'Mentor tidak tersedia pada waktu tersebut'
            ],
            [
                'member_id' => $member->id,
                'mentor_id' => $mentor->id,
                'training_type' => 'UI/UX Design',
                'proposed_date' => '2024-01-25',
                'proposed_time' => '09:00:00',
                'status' => 'completed'
            ],
            [
                'member_id' => $member->id,
                'mentor_id' => $mentor->id,
                'training_type' => 'Administrasi Perkantoran',
                'proposed_date' => '2024-01-30',
                'proposed_time' => '13:00:00',
                'status' => 'rejected',
                'rejection_reason' => 'Jadwal dibatalkan oleh member'
            ]
        ];

        foreach ($schedules as $scheduleData) {
            Schedule::create($scheduleData);
        }

        $this->command->info('Test riwayat data created successfully!');
    }
}