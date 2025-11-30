<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestPendingAdminVerificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();

        // Test data untuk status pending_admin_verification
        DB::table('schedules')->insert([
            [
                'Id_schedles' => 'SC999',
                'member_id' => 'U1',
                'mentor_id' => 'U2',
                'Id_specializations' => 'S1',
                'training_type' => 'Daring',
                'proposed_date' => '2025-10-25',
                'proposed_time' => '09:00:00',
                'status' => 'pending_admin_verification',
                'rejection_reason' => 'Mentor menolak karena konflik jadwal, perlu verifikasi admin',
                'materi_modul' => 'Modul Test',
                'materi_topik' => 'Topik Test',
                'materi_sub_topik' => 'Sub Topik Test',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_schedles' => 'SC998',
                'member_id' => 'U1',
                'mentor_id' => 'U3',
                'Id_specializations' => 'S2',
                'training_type' => 'Luring',
                'proposed_date' => '2025-10-26',
                'proposed_time' => '14:00:00',
                'status' => 'pending_admin_verification',
                'rejection_reason' => 'Mentor tidak tersedia pada waktu yang diminta, perlu alternatif dari admin',
                'materi_modul' => 'Modul Test 2',
                'materi_topik' => 'Topik Test 2',
                'materi_sub_topik' => 'Sub Topik Test 2',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        echo "Test data untuk pending_admin_verification berhasil dibuat!\n";
    }
}
