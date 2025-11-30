<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;
use App\Models\Schedule;
use App\Models\Rating;
use App\Models\Meeting;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil data dari database
        $mentors = User::where('role', 'mentor')->get();
        $members = User::where('role', 'member')->get();
        $admins = User::where('role', 'admin')->get();
        $schedules = Schedule::with(['member', 'mentor'])->get();
        $ratings = Rating::with(['member', 'mentor'])->get();
        
        $notifications = [];
        
        // ===============================================
        // 1. Notifikasi Schedule Confirmed (5 notifikasi)
        // ===============================================
        $confirmedSchedules = $schedules->where('status', 'confirmed')->take(5);
        foreach ($confirmedSchedules as $schedule) {
            $notifications[] = [
                'user_id' => $schedule->member_id,
                'type' => 'schedule_confirmed',
                'title' => 'Jadwal Dikonfirmasi',
                'message' => "Jadwal Anda dengan mentor {$schedule->mentor->name} pada tanggal " . Carbon::parse($schedule->proposed_date)->format('d F Y') . " jam {$schedule->proposed_time} telah dikonfirmasi.",
                'data' => [
                    'schedule_id' => $schedule->Id_schedles,
                    'mentor_name' => $schedule->mentor->name,
                    'member_name' => $schedule->member->name,
                    'date' => $schedule->proposed_date,
                    'time' => $schedule->proposed_time
                ],
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(rand(1, 48)),
                'updated_at' => Carbon::now()->subHours(rand(1, 48))
            ];
        }
        
        // ===============================================
        // 2. Notifikasi Schedule Rejected (3 notifikasi)
        // ===============================================
        $rejectedSchedules = $schedules->where('status', 'rejected')->take(3);
        foreach ($rejectedSchedules as $schedule) {
            $notifications[] = [
                'user_id' => $schedule->member_id,
                'type' => 'schedule_rejected',
                'title' => 'Jadwal Ditolak',
                'message' => "Jadwal Anda dengan mentor {$schedule->mentor->name} telah ditolak. " . ($schedule->rejection_reason ? "Alasan: {$schedule->rejection_reason}" : "Silakan jadwalkan ulang."),
                'data' => [
                    'schedule_id' => $schedule->Id_schedles,
                    'mentor_name' => $schedule->mentor->name,
                    'rejection_reason' => $schedule->rejection_reason
                ],
                'is_read' => rand(0, 1) == 1,
                'read_at' => rand(0, 1) == 1 ? Carbon::now()->subHours(rand(1, 24)) : null,
                'created_at' => Carbon::now()->subDays(rand(1, 7)),
                'updated_at' => Carbon::now()->subDays(rand(1, 7))
            ];
        }
        
        // ===============================================
        // 3. Notifikasi Schedule Pending Admin Verification (4 notifikasi)
        // ===============================================
        $pendingVerification = $schedules->where('status', 'pending_admin_verification')->take(4);
        foreach ($pendingVerification as $schedule) {
            // Notifikasi untuk member
            $notifications[] = [
                'user_id' => $schedule->member_id,
                'type' => 'pending_admin_verification',
                'title' => 'Verifikasi Admin Diperlukan',
                'message' => "Jadwal Anda dengan mentor {$schedule->mentor->name} sedang menunggu verifikasi admin.",
                'data' => [
                    'schedule_id' => $schedule->Id_schedles,
                    'mentor_name' => $schedule->mentor->name
                ],
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(rand(1, 12)),
                'updated_at' => Carbon::now()->subHours(rand(1, 12))
            ];
        }
        
        // ===============================================
        // 4. Notifikasi Rating Received (4 notifikasi untuk mentor)
        // ===============================================
        foreach ($ratings->take(4) as $rating) {
            $notifications[] = [
                'user_id' => $rating->mentor_id,
                'type' => 'rating_received',
                'title' => 'Anda Menerima Rating Baru',
                'message' => "{$rating->member->name} memberikan rating {$rating->rating} bintang untuk Anda." . ($rating->review ? " Ulasan: \"{$rating->review}\"" : ""),
                'data' => [
                    'rating_id' => $rating->id_rating,
                    'member_name' => $rating->member->name,
                    'rating' => $rating->rating,
                    'review' => $rating->review
                ],
                'is_read' => rand(0, 1) == 1,
                'read_at' => rand(0, 1) == 1 ? Carbon::now()->subHours(rand(1, 36)) : null,
                'created_at' => $rating->created_at,
                'updated_at' => $rating->updated_at
            ];
        }
        
        // ===============================================
        // 5. Notifikasi Meeting Completed (3 notifikasi)
        // ===============================================
        $completedMeetings = Meeting::with(['member', 'mentor'])->where('status', 'completed')->take(3)->get();
        foreach ($completedMeetings as $meeting) {
            // Notifikasi untuk member
            $notifications[] = [
                'user_id' => $meeting->member_id,
                'type' => 'meeting_completed',
                'title' => 'Pertemuan Selesai',
                'message' => "Pertemuan Anda dengan mentor {$meeting->mentor->name} telah selesai. Jangan lupa berikan rating!",
                'data' => [
                    'meeting_id' => $meeting->id,
                    'mentor_name' => $meeting->mentor->name
                ],
                'is_read' => false,
                'created_at' => Carbon::now()->subDays(rand(1, 5)),
                'updated_at' => Carbon::now()->subDays(rand(1, 5))
            ];
            
            // Notifikasi untuk mentor
            $notifications[] = [
                'user_id' => $meeting->mentor_id,
                'type' => 'meeting_completed',
                'title' => 'Pertemuan Selesai',
                'message' => "Pertemuan Anda dengan member {$meeting->member->name} telah selesai.",
                'data' => [
                    'meeting_id' => $meeting->id,
                    'member_name' => $meeting->member->name
                ],
                'is_read' => rand(0, 1) == 1,
                'read_at' => rand(0, 1) == 1 ? Carbon::now()->subHours(rand(1, 24)) : null,
                'created_at' => Carbon::now()->subDays(rand(1, 5)),
                'updated_at' => Carbon::now()->subDays(rand(1, 5))
            ];
        }
        
        // ===============================================
        // 6. Notifikasi User Added (2 notifikasi untuk admin)
        // ===============================================
        if ($admins->isNotEmpty() && $members->count() >= 3) {
            $newMembers = $members->take(2);
            foreach ($newMembers as $member) {
                $notifications[] = [
                    'user_id' => $admins->first()->id_user,
                    'type' => 'user_added',
                    'title' => 'Pengguna Baru Ditambahkan',
                    'message' => "Member baru '{$member->name}' telah mendaftar ke sistem.",
                    'data' => [
                        'user_name' => $member->name,
                        'user_email' => $member->email,
                        'user_role' => 'member',
                        'user_id' => $member->id_user
                    ],
                    'is_read' => true,
                    'read_at' => Carbon::now()->subDays(rand(1, 10)),
                    'created_at' => $member->created_at,
                    'updated_at' => $member->created_at
                ];
            }
        }
        
        // ===============================================
        // 7. Notifikasi Remaining Sessions (1 notifikasi)
        // ===============================================
        $memberWithLowSessions = $members->filter(function($member) {
            return $member->memberProfile && $member->memberProfile->remaining_sessions <= 3;
        })->first();
        
        if ($memberWithLowSessions) {
            $notifications[] = [
                'user_id' => $memberWithLowSessions->id_user,
                'type' => 'remaining_sessions_low',
                'title' => 'Sesi Pembelajaran Menipis',
                'message' => "Peringatan! Anda hanya memiliki {$memberWithLowSessions->memberProfile->remaining_sessions} sesi pembelajaran tersisa.",
                'data' => [
                    'remaining_sessions' => $memberWithLowSessions->memberProfile->remaining_sessions
                ],
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(rand(1, 24)),
                'updated_at' => Carbon::now()->subHours(rand(1, 24))
            ];
        }
        
        // ===============================================
        // 8. Notifikasi Welcome (1 notifikasi untuk member baru)
        // ===============================================
        if ($members->count() > 0) {
            $newMember = $members->last();
            $notifications[] = [
                'user_id' => $newMember->id_user,
                'type' => 'welcome',
                'title' => 'Selamat Datang di Sistem Manajemen Bimbingan Digital',
                'message' => "Halo {$newMember->name}! Selamat bergabung dengan kami. Mari mulai perjalanan pembelajaran Anda!",
                'data' => [
                    'user_name' => $newMember->name
                ],
                'is_read' => false,
                'created_at' => $newMember->created_at,
                'updated_at' => $newMember->created_at
            ];
        }
        
        // ===============================================
        // 9. Notifikasi Course Recommendation (1 notifikasi)
        // ===============================================
        if ($members->count() > 0) {
            $randomMember = $members->random();
            $notifications[] = [
                'user_id' => $randomMember->id_user,
                'type' => 'course_recommendation',
                'title' => 'Rekomendasi Kursus',
                'message' => "Berdasarkan profil Anda, kami merekomendasikan kursus Web Programming Basic untuk meningkatkan skill Anda!",
                'data' => [
                    'recommended_course' => 'Web Programming Basic'
                ],
                'is_read' => false,
                'created_at' => Carbon::now()->subDays(rand(1, 15)),
                'updated_at' => Carbon::now()->subDays(rand(1, 15))
            ];
        }
        
        // Shuffle notifications untuk variasi waktu
        shuffle($notifications);
        
        // Create notifications
        foreach ($notifications as $notification) {
            Notification::create($notification);
        }
        
        $this->command->info('Created ' . count($notifications) . ' notifications successfully!');
        $this->command->info('Summary:');
        $this->command->info('- Schedule Confirmed: ' . count(array_filter($notifications, fn($n) => $n['type'] === 'schedule_confirmed')));
        $this->command->info('- Schedule Rejected: ' . count(array_filter($notifications, fn($n) => $n['type'] === 'schedule_rejected')));
        $this->command->info('- Pending Verification: ' . count(array_filter($notifications, fn($n) => $n['type'] === 'pending_admin_verification')));
        $this->command->info('- Rating Received: ' . count(array_filter($notifications, fn($n) => $n['type'] === 'rating_received')));
        $this->command->info('- Meeting Completed: ' . count(array_filter($notifications, fn($n) => $n['type'] === 'meeting_completed')));
        $this->command->info('- User Added: ' . count(array_filter($notifications, fn($n) => $n['type'] === 'user_added')));
        $this->command->info('- Other types: ' . (count($notifications) - count(array_filter($notifications, fn($n) => in_array($n['type'], ['schedule_confirmed', 'schedule_rejected', 'pending_admin_verification', 'rating_received', 'meeting_completed', 'user_added'])))));
    }
}
