<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Meeting;
use Carbon\Carbon;

class MeetingSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil semua mentor dan member
        $mentors = User::where('role', 'mentor')->get();
        $members = User::where('role', 'member')->get();

        if ($mentors->isEmpty() || $members->isEmpty()) {
            $this->command->warn('Tidak ada mentor atau member. Pastikan UserSeeder sudah dijalankan.');
            return;
        }

        // Topik-topik pertemuan yang variatif
        $topics = [
            'Pengenalan Dasar Web Programming',
            'HTML dan CSS Fundamentals',
            'JavaScript Basics',
            'React.js Introduction',
            'Database Design',
            'API Development',
            'UI/UX Design Principles',
            'Figma untuk Design',
            'Adobe Photoshop Dasar',
            'Administrasi Perkantoran Modern',
            'Manajemen Dokumen',
            'Review Progress',
            'Q&A Session',
            'Project Review',
            'Final Assessment'
        ];

        // Status yang akan digunakan (lebih banyak completed untuk dashboard)
        $statuses = ['completed', 'completed', 'completed', 'completed', 'pending', 'confirmed', 'cancelled'];
        
        $meetingsCreated = 0;

        // Notes dan feedback untuk meetings yang completed
        $notesOptions = [
            'Sesi berjalan dengan baik, member sudah memahami konsep dasar.',
            'Pembahasan materi sangat detail dan mudah dipahami.',
            'Member aktif bertanya dan diskusi berjalan lancar.',
            'Progress member sangat baik, sudah bisa mengimplementasikan materi.',
            'Sesi review project berhasil, ada beberapa improvement yang disarankan.'
        ];
        
        $feedbackOptions = [
            'Sangat membantu, mentor menjelaskan dengan sabar.',
            'Materi mudah dipahami dan praktis.',
            'Sesi pembelajaran sangat efektif.',
            'Terima kasih atas bimbingannya.',
            'Penjelasan sangat jelas dan detail.'
        ];

        // Buat meetings untuk setiap mentor dengan berbagai member
        foreach ($mentors as $mentor) {
            // Setiap mentor akan memiliki 5-12 meetings completed
            $completedCount = rand(5, 12);
            $totalMeetings = $completedCount + rand(2, 5); // Tambah beberapa meetings dengan status lain
            
            for ($i = 0; $i < $totalMeetings; $i++) {
                // Pilih member random
                $member = $members->random();
                
                // Tentukan status: completed untuk yang pertama, lalu random untuk sisanya
                $status = $i < $completedCount ? 'completed' : $statuses[array_rand($statuses)];
                
                // Generate tanggal random dalam 3 bulan terakhir
                $daysAgo = rand(1, 90);
                $schedule = Carbon::now()->subDays($daysAgo);
                
                // Random jam antara 09:00 - 17:00
                $hour = rand(9, 17);
                $minute = rand(0, 1) * 30; // 00 atau 30
                $schedule->setTime($hour, $minute, 0);
                
                // Pilih topic random
                $topic = $topics[array_rand($topics)];
                
                Meeting::create([
                    'member_id' => $member->id_user,
                    'mentor_id' => $mentor->id_user,
                    'schedule' => $schedule,
                    'status' => $status,
                    'topic' => $topic,
                    'notes' => $status === 'completed' ? $notesOptions[array_rand($notesOptions)] : null,
                    'feedback' => $status === 'completed' ? $feedbackOptions[array_rand($feedbackOptions)] : null,
                    'rating' => $status === 'completed' ? rand(4, 5) : null, // Rating 4-5 untuk completed
                    'created_at' => $schedule->copy()->subDays(rand(1, 5)),
                    'updated_at' => $status === 'completed' ? $schedule->copy()->addHours(rand(1, 3)) : Carbon::now(),
                ]);
                
                $meetingsCreated++;
            }
        }

        $this->command->info("Berhasil membuat {$meetingsCreated} meetings untuk dashboard admin.");
    }
}


