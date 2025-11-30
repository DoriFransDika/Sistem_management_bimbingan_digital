<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MentorSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('mentor_profiles')->insert([
            [
                'Id_mentor' => 'MT1',
                'user_id' => 'U2',
                'phone' => '08123456723',
                'specialization_ids' => json_encode(['S4']),
                'available_day_ids' => json_encode(['D2']),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_mentor' => 'MT2',
                'user_id' => 'U3',
                'phone' => '08781234567',
                'specialization_ids' => json_encode(['S3']),
                'available_day_ids' => json_encode(['D4']),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_mentor' => 'MT3',
                'user_id' => 'U4',
                'phone' => '08967654321',
                'specialization_ids' => json_encode(['S2']),
                'available_day_ids' => json_encode(['D6']),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}


