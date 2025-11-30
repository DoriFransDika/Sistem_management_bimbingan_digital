<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Rating;

class RatingsSeeder extends Seeder
{
    public function run(): void
    {
        $mentors = User::where('role', 'mentor')->take(3)->get();
        $members = User::where('role', 'member')->take(5)->get();

        if ($mentors->isEmpty() || $members->isEmpty()) {
            return;
        }

        $rows = [
            [
                'mentor' => $mentors[0],
                'member' => $members[0],
                'rating' => 5,
                'review' => 'Sesi sangat membantu.'
            ],
            [
                'mentor' => $mentors[0] ?? $mentors[0],
                'member' => $members[1] ?? $members[0],
                'rating' => 4,
                'review' => 'Penjelasan jelas dan detail.'
            ],
            [
                'mentor' => $mentors[0] ?? $mentors[0],
                'member' => $members[2] ?? $members[0],
                'rating' => 5,
                'review' => 'Materi tepat sasaran.'
            ],
            [
                'mentor' => $mentors[1],
                'member' => $members[3] ?? $members[0],
                'rating' => 5,
                'review' => 'Mentor responsif dan enak diajak diskusi.'
            ],

            [
                'mentor' => $mentors[2],
                'member' => $members[4] ?? $members[0],
                'rating' => 3,
                'review' => 'Masih ada beberapa materi yang kurang jelas.'
            ],
            [
                'mentor' => $mentors[2],
                'member' => $members[1] ?? $members[0],
                'rating' => 4,
                'review' => 'Pembawaan santai tapi tetap fokus.'
            ],
            [
                'mentor' => $mentors[2],
                'member' => $members[5] ?? $members[0],
                'rating' => 1,
                'review' => 'metor kurang sopan.'
            ],
        ];

        foreach ($rows as $r) {
            Rating::create([
                'mentor_id' => $r['mentor']->id_user,
                'member_id' => $r['member']->id_user,
                'rating' => $r['rating'],
                'review' => $r['review'],
            ]);
        }
    }
}


