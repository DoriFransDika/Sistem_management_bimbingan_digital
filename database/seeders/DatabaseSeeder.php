<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // HAPUS SEMUA BARIS LAIN DAN PASTIKAN HANYA ADA INI
        $this->call([
            AvailableDaySeeder::class,
            SpecializationSeeder::class,
            UserSeeder::class,
            memberSeeder::class,
            mentorSeeder::class,
            MateriSeeder::class,
            ConfirmedScheduleSeeder::class,
            LaporanTestSeeder::class,
            RatingsSeeder::class,
            MeetingSeeder::class,
            MeetingHistorySeeder::class,
            NotificationSeeder::class, // Tambahkan seeder notifikasi
            VerificationContentSeeder::class, // Seeder untuk data verification (penolakan jadwal)
        ]);
    }
}