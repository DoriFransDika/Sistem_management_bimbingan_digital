<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User; 
use Illuminate\Support\Facades\Schema;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Nonaktifkan pengecekan foreign key
        Schema::disableForeignKeyConstraints();

        // Hapus data lama
        User::truncate();

        // Aktifkan kembali pengecekan foreign key
        Schema::enableForeignKeyConstraints();
        
        // Masukkan data baru (20 Pengguna)
        $users = [
            // U1: Admin
            [
                'name' => 'Admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // U2 - U4: Mentors
            [
                'name' => 'Dori Frans Dika',
                'email' => 'dori@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'mentor',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Rahman',
                'email' => 'Rahman@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'mentor',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Aldi',
                'email' => 'Aldi@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'mentor',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // U5 - U20: Members
            [
                'name' => 'Nadia Maharani',
                'email' => 'Nadia@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Adeka Putra',
                'email' => 'putra@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Risa Oktaviani',
                'email' => 'Risa@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bima Sakti',
                'email' => 'Bima@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sinta Dewi',
                'email' => 'Sinta@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Kevin Sanjaya',
                'email' => 'Kevin@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fitriani',
                'email' => 'Fitriani@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Rio Andika',
                'email' => 'Rio@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Citra Kirana',
                'email' => 'Citra@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Eko Prasetyo',
                'email' => 'Eko@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Maya Sari',
                'email' => 'Maya@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dani Kurniawan',
                'email' => 'Dani@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Linda Susanti',
                'email' => 'Linda@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fajar Hidayat',
                'email' => 'Fajar@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gita Ramadhani',
                'email' => 'Gita@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Harris Pratama',
                'email' => 'Harris@gmail.com',
                'password' => Hash::make('123123'),
                'role' => 'member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($users as $data) {
            User::create($data);
        }
    }
}
