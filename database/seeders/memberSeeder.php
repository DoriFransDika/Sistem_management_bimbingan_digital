<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('member_profiles')->insert([
            [
                'Id_member' => 'MB1',
                'user_id' => 'U5',
                'phone' => '08231234567',
                'Id_specializations' => 'S4',
                'delivery_mode' => 'Daring',
                'remaining_sessions' => 8,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB2',
                'user_id' => 'U6',
                'phone' => '08229876543',
                'Id_specializations' => 'S3',
                'delivery_mode' => 'Luring',
                'remaining_sessions' => 12,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB3',
                'user_id' => 'U7',
                'phone' => '08125555666',
                'Id_specializations' => 'S2',
                'delivery_mode' => 'Daring',
                'remaining_sessions' => 15,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB4',
                'user_id' => 'U8',
                'phone' => '08781111222',
                'Id_specializations' => 'S1',
                'delivery_mode' => 'Luring',
                'remaining_sessions' => 10,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB5',
                'user_id' => 'U9',
                'phone' => '08963333444',
                'Id_specializations' => 'S4',
                'delivery_mode' => 'Daring',
                'remaining_sessions' => 9,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB6',
                'user_id' => 'U10',
                'phone' => '08570000111',
                'Id_specializations' => 'S3',
                'delivery_mode' => 'Daring',
                'remaining_sessions' => 14,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB7',
                'user_id' => 'U11',
                'phone' => '08137777888',
                'Id_specializations' => 'S1',
                'delivery_mode' => 'Luring',
                'remaining_sessions' => 11,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB8',
                'user_id' => 'U12',
                'phone' => '08214444555',
                'Id_specializations' => 'S2',
                'delivery_mode' => 'Daring',
                'remaining_sessions' => 13,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB9',
                'user_id' => 'U13',
                'phone' => '08529999000',
                'Id_specializations' => 'S4',
                'delivery_mode' => 'Luring',
                'remaining_sessions' => 10,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB10',
                'user_id' => 'U14',
                'phone' => '08776666555',
                'Id_specializations' => 'S3',
                'delivery_mode' => 'Daring',
                'remaining_sessions' => 8,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB11',
                'user_id' => 'U15',
                'phone' => '08953333222',
                'Id_specializations' => 'S2',
                'delivery_mode' => 'Luring',
                'remaining_sessions' => 12,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB12',
                'user_id' => 'U16',
                'phone' => '08121010202',
                'Id_specializations' => 'S1',
                'delivery_mode' => 'Daring',
                'remaining_sessions' => 15,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB13',
                'user_id' => 'U17',
                'phone' => '08235050606',
                'Id_specializations' => 'S4',
                'delivery_mode' => 'Luring',
                'remaining_sessions' => 9,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB14',
                'user_id' => 'U18',
                'phone' => '08784040505',
                'Id_specializations' => 'S3',
                'delivery_mode' => 'Luring',
                'remaining_sessions' => 14,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB15',
                'user_id' => 'U19',
                'phone' => '08573030404',
                'Id_specializations' => 'S2',
                'delivery_mode' => 'Luring',
                'remaining_sessions' => 11,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Id_member' => 'MB16',
                'user_id' => 'U20',
                'phone' => '08132020303',
                'Id_specializations' => 'S1',
                'delivery_mode' => 'Daring',
                'remaining_sessions' => 13,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}


