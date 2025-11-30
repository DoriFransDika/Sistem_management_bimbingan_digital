<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AvailableDay;

class AvailableDaySeeder extends Seeder
{
    public function run(): void
    {
        $days = [
            'Senin',
            'Selasa', 
            'Rabu',
            'Kamis',
            'Jumat',
            'Sabtu',
            'Minggu'
        ];

        foreach ($days as $index => $day) {
            AvailableDay::firstOrCreate(
                ['name' => $day],
                ['name' => $day, 'sort_order' => $index + 1]
            );
        }
    }
}