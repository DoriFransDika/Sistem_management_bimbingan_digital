<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Specialization;

class SpecializationSeeder extends Seeder
{
    public function run(): void
    {
        $names = [
            'Administrasi Perkantoran',
            'Graphic Design',
            'Web Programming Basic',
            'UI/UX Design',
        ];

        foreach ($names as $name) {
            Specialization::firstOrCreate(['name' => $name], ['name' => $name]);
        }
    }
}