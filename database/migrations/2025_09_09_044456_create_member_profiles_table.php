<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_profiles', function (Blueprint $table) {
            // Primary key untuk tabel member profiles
            $table->string('Id_member', 20)->primary();
            
            // Kunci relasi One-to-One ke tabel users
            $table->string('user_id', 20)->unique();
            $table->foreign('user_id')->references('id_user')->on('users')->onDelete('cascade');
            
            // Data pribadi member
            $table->string('phone')->nullable(); // Nomor telepon member
            
            // Mode pertemuan (Daring/Luring) sesuai model & database
            $table->string('delivery_mode')->default('Daring');
            
            // Relasi ke tabel specializations
            $table->string('Id_specializations', 20)->nullable();
            $table->foreign('Id_specializations')->references('Id_specializations')->on('specializations')->nullOnDelete();
            
            // Jumlah sesi yang tersisa untuk member
            $table->integer('remaining_sessions')->default(0);
            
            // Timestamp untuk tracking waktu pembuatan dan update
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_profiles');
    }
};