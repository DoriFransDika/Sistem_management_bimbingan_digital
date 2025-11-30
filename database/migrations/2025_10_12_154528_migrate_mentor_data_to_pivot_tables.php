<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate data spesialisasi mentor dari mentor_profiles ke pivot table mentor_specializations
        DB::statement("
            INSERT INTO mentor_specializations (user_id, Id_specializations, created_at, updated_at)
            SELECT user_id, Id_specializations, NOW(), NOW()
            FROM mentor_profiles 
            WHERE Id_specializations IS NOT NULL
        ");

        // Migrate data hari tersedia mentor dari mentor_profiles ke pivot table mentor_available_days
        DB::statement("
            INSERT INTO mentor_available_days (user_id, Id_day, created_at, updated_at)
            SELECT user_id, Id_day, NOW(), NOW()
            FROM mentor_profiles 
            WHERE Id_day IS NOT NULL
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove migrated data from pivot tables
        DB::table('mentor_specializations')->truncate();
        DB::table('mentor_available_days')->truncate();
    }
};
