<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mentor_profiles', function (Blueprint $table) {
            // Primary key untuk tabel mentor profiles
            $table->string('Id_mentor', 20)->primary();
            
            // Kunci relasi One-to-One ke tabel users
            $table->string('user_id', 20)->unique();
            $table->foreign('user_id')->references('id_user')->on('users')->onDelete('cascade');
            
            // Data pribadi mentor
            $table->string('phone')->nullable(); // Nomor telepon mentor
            
            // Relasi ke hari tersedia (hari kerja mentor)
            $table->string('Id_day', 20)->nullable();
            $table->foreign('Id_day')->references('Id_day')->on('available_days')->nullOnDelete();
            
            // Relasi ke spesialisasi mentor
            $table->string('Id_specializations', 20)->nullable();
            $table->foreign('Id_specializations')->references('Id_specializations')->on('specializations')->nullOnDelete();

            // Timestamp untuk tracking waktu pembuatan dan update
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mentor_profiles');
    }
};