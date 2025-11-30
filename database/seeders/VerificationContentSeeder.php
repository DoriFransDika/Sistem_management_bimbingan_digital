<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Schedule;
use App\Models\User;
use App\Models\Specialization;


class VerificationContentSeeder extends Seeder
{
    public function run(): void
    {
        $members = User::where('role', 'member')->get();
        $mentors = User::where('role', 'mentor')->get();

        // Validasi: Pastikan member dan mentor sudah ada
        if ($members->isEmpty() || $mentors->isEmpty()) {
            $this->command->error('❌ Member atau Mentor tidak ditemukan!');
            $this->command->info('💡 Silakan jalankan UserSeeder terlebih dahulu.');
            return;
        }
        $specializations = Specialization::all();
        
        if ($specializations->isEmpty()) {
            $this->command->error('❌ Specialization tidak ditemukan!');
            $this->command->info('💡 Silakan jalankan SpecializationSeeder terlebih dahulu.');
            return;
        }

        // Ambil beberapa Id_specializations untuk digunakan
        $specializationIds = $specializations->pluck('Id_specializations')->toArray();
        $schedules = [
            [
                'member_id' => $members[0]->id_user,
                'mentor_id' => $mentors[0]->id_user,
                'Id_specializations' => $specializationIds[0] ?? 'S1',
                'proposed_date' => now()->addDays(5)->format('Y-m-d'),
                'proposed_time' => '10:00:00',
                'status' => 'pending_admin_verification',
                'rejection_reason' => 'Jadwal bentrok dengan kegiatan lain. Mohon reschedule ke tanggal lain.',
            ],
            [
                // Menggunakan member dan mentor yang berbeda untuk variasi
                'member_id' => $members->count() > 1 ? $members[1]->id_user : $members[0]->id_user,
                'mentor_id' => $mentors->count() > 1 ? $mentors[1]->id_user : $mentors[0]->id_user,
                'Id_specializations' => $specializationIds[1] ?? ($specializationIds[0] ?? 'S2'),
                'proposed_date' => now()->addDays(7)->format('Y-m-d'),
                'proposed_time' => '14:00:00',
                'status' => 'pending_admin_verification',
                'rejection_reason' => 'Mentor sedang tidak tersedia pada tanggal tersebut. Silakan pilih tanggal lain.',
            ],
            [
                // Menggunakan member dan mentor yang berbeda lagi
                'member_id' => $members->count() > 2 ? $members[2]->id_user : $members[0]->id_user,
                'mentor_id' => $mentors->count() > 2 ? $mentors[2]->id_user : ($mentors->count() > 1 ? $mentors[1]->id_user : $mentors[0]->id_user),
                'Id_specializations' => $specializationIds[2] ?? ($specializationIds[0] ?? 'S3'),
                'proposed_date' => now()->addDays(10)->format('Y-m-d'),
                'proposed_time' => '09:00:00',
                'status' => 'pending_admin_verification',
                'rejection_reason' => 'Topik yang diminta belum siap. Perlu persiapan lebih lanjut.',
            ],
            [
                // Data keempat dengan alasan berbeda
                'member_id' => $members->count() > 3 ? $members[3]->id_user : $members[0]->id_user,
                'mentor_id' => $mentors[0]->id_user,
                'Id_specializations' => $specializationIds[3] ?? ($specializationIds[0] ?? 'S4'),
                'proposed_date' => now()->addDays(12)->format('Y-m-d'),
                'proposed_time' => '15:00:00',
                'status' => 'pending_admin_verification',
                'rejection_reason' => 'Waktu yang diusulkan tidak sesuai dengan jadwal mentor. Mohon pilih waktu pagi atau siang.',
            ],
            [
                // Data kelima
                'member_id' => $members->count() > 4 ? $members[4]->id_user : $members[0]->id_user,
                'mentor_id' => $mentors->count() > 1 ? $mentors[1]->id_user : $mentors[0]->id_user,
                'Id_specializations' => $specializationIds[0] ?? 'S1',
                'proposed_date' => now()->addDays(15)->format('Y-m-d'),
                'proposed_time' => '11:00:00',
                'status' => 'pending_admin_verification',
                'rejection_reason' => 'Materi yang diminta memerlukan persiapan khusus. Perlu waktu lebih untuk menyiapkan bahan ajar.',
            ],
        ];

        // ===================================================================
        // INSERT DATA KE DATABASE
        // ===================================================================
        $createdCount = 0;
        $errorCount = 0;
        
        foreach ($schedules as $index => $scheduleData) {
            try {
                // Schedule::create() akan otomatis membuat Id_schedles (SC1, SC2, dll)
                $schedule = Schedule::create($scheduleData);
                $createdCount++;
                
                $scheduleNumber = $index + 1;
                $this->command->info("✅ Schedule #{$scheduleNumber} berhasil dibuat: {$schedule->Id_schedles}");
            } catch (\Exception $e) {
                $errorCount++;
                $scheduleNumber = $index + 1;
                $this->command->error("❌ Gagal membuat schedule #{$scheduleNumber}: " . $e->getMessage());
            }
        }

        // ===================================================================
        // TAMPILKAN HASIL
        // ===================================================================
        $this->command->newLine();
        if ($createdCount > 0) {
            $this->command->info("✅ Berhasil membuat {$createdCount} data penolakan jadwal!");
            $this->command->info("📋 Data ini akan muncul di halaman Admin Verification");
            $this->command->info("🔗 Akses: /admin/verification");
        }
        
        if ($errorCount > 0) {
            $this->command->warn("⚠️  Terjadi {$errorCount} error saat membuat data.");
        }
        
        if ($createdCount === 0 && $errorCount === 0) {
            $this->command->warn("⚠️  Tidak ada data yang dibuat. Pastikan semua seeder sudah dijalankan.");
        }
    }
}

