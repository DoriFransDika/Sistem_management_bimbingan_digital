<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;
use App\Models\Meeting;
use App\Models\Report;

class NotificationActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing notifications
        Notification::truncate();

        // Get some users for realistic data
        $mentors = User::where('role', 'mentor')->get();
        $members = User::where('role', 'member')->get();

        $notifications = [];

        // Generate notifications based on real activities
        for ($i = 0; $i < 50; $i++) {
            $type = $this->getRandomType();
            $notification = $this->createNotificationByType($type, $mentors, $members);
            if ($notification) {
                $notifications[] = $notification;
            }
        }

        // Insert all notifications
        foreach ($notifications as $notification) {
            Notification::create($notification);
        }
    }

    private function getRandomType()
    {
        $types = ['schedule_confirmed', 'report_approved', 'user_added', 'meeting_created', 'meeting_cancelled', 'report_rejected'];
        return $types[array_rand($types)];
    }

    private function createNotificationByType($type, $mentors, $members)
    {
        $baseTime = now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));
        
        switch ($type) {
            case 'schedule_confirmed':
                if ($mentors->count() > 0 && $members->count() > 0) {
                    $mentor = $mentors->random();
                    $member = $members->random();
                    return [
                        'type' => 'schedule_confirmed',
                        'title' => 'Jadwal Dikonfirmasi',
                        'message' => "Mentor {$mentor->name} mengonfirmasi jadwal dengan {$member->name}.",
                        'data' => [
                            'mentor_name' => $mentor->name,
                            'member_name' => $member->name,
                            'meeting_date' => $baseTime->addHours(rand(1, 48))->format('Y-m-d H:i:s')
                        ],
                        'is_read' => rand(0, 1) == 1,
                        'read_at' => rand(0, 1) == 1 ? $baseTime->addMinutes(rand(1, 60)) : null,
                        'created_at' => $baseTime,
                        'updated_at' => $baseTime
                    ];
                }
                break;

            case 'report_approved':
                if ($members->count() > 0) {
                    $member = $members->random();
                    return [
                        'type' => 'report_approved',
                        'title' => 'Laporan Disetujui',
                        'message' => "Laporan sesi untuk {$member->name} telah disetujui.",
                        'data' => [
                            'member_name' => $member->name,
                            'report_id' => rand(1, 100),
                            'approved_by' => 'Admin'
                        ],
                        'is_read' => rand(0, 1) == 1,
                        'read_at' => rand(0, 1) == 1 ? $baseTime->addMinutes(rand(1, 30)) : null,
                        'created_at' => $baseTime,
                        'updated_at' => $baseTime
                    ];
                }
                break;

            case 'user_added':
                $roles = ['mentor', 'member'];
                $role = $roles[array_rand($roles)];
                $names = ['Ahmad', 'Siti', 'Budi', 'Dewi', 'Eko', 'Fina', 'Gita', 'Hadi', 'Indra', 'Jihan'];
                $name = $names[array_rand($names)];
                
                return [
                    'type' => 'user_added',
                    'title' => 'Pengguna Baru Ditambahkan',
                    'message' => "Pengguna baru '{$name}' ditambahkan sebagai " . ucfirst($role) . ".",
                    'data' => [
                        'user_name' => $name,
                        'user_role' => $role,
                        'added_by' => 'Admin'
                    ],
                    'is_read' => rand(0, 1) == 1,
                    'read_at' => rand(0, 1) == 1 ? $baseTime->addMinutes(rand(1, 120)) : null,
                    'created_at' => $baseTime,
                    'updated_at' => $baseTime
                ];

            case 'meeting_created':
                if ($mentors->count() > 0 && $members->count() > 0) {
                    $mentor = $mentors->random();
                    $member = $members->random();
                    return [
                        'type' => 'meeting_created',
                        'title' => 'Pertemuan Baru Dibuat',
                        'message' => "Pertemuan baru antara Mentor {$mentor->name} dan Member {$member->name} telah dibuat.",
                        'data' => [
                            'mentor_name' => $mentor->name,
                            'member_name' => $member->name,
                            'meeting_date' => $baseTime->addHours(rand(1, 72))->format('Y-m-d H:i:s')
                        ],
                        'is_read' => rand(0, 1) == 1,
                        'read_at' => rand(0, 1) == 1 ? $baseTime->addMinutes(rand(1, 30)) : null,
                        'created_at' => $baseTime,
                        'updated_at' => $baseTime
                    ];
                }
                break;

            case 'meeting_cancelled':
                if ($mentors->count() > 0 && $members->count() > 0) {
                    $mentor = $mentors->random();
                    $member = $members->random();
                    return [
                        'type' => 'meeting_cancelled',
                        'title' => 'Pertemuan Dibatalkan',
                        'message' => "Pertemuan antara Mentor {$mentor->name} dan Member {$member->name} telah dibatalkan.",
                        'data' => [
                            'mentor_name' => $mentor->name,
                            'member_name' => $member->name,
                            'cancelled_at' => $baseTime->format('Y-m-d H:i:s')
                        ],
                        'is_read' => rand(0, 1) == 1,
                        'read_at' => rand(0, 1) == 1 ? $baseTime->addMinutes(rand(1, 60)) : null,
                        'created_at' => $baseTime,
                        'updated_at' => $baseTime
                    ];
                }
                break;

            case 'report_rejected':
                if ($members->count() > 0) {
                    $member = $members->random();
                    return [
                        'type' => 'report_rejected',
                        'title' => 'Laporan Ditolak',
                        'message' => "Laporan sesi untuk {$member->name} telah ditolak dan perlu diperbaiki.",
                        'data' => [
                            'member_name' => $member->name,
                            'report_id' => rand(1, 100),
                            'rejected_by' => 'Admin',
                            'reason' => 'Data tidak lengkap'
                        ],
                        'is_read' => rand(0, 1) == 1,
                        'read_at' => rand(0, 1) == 1 ? $baseTime->addMinutes(rand(1, 45)) : null,
                        'created_at' => $baseTime,
                        'updated_at' => $baseTime
                    ];
                }
                break;
        }

        return null;
    }
}