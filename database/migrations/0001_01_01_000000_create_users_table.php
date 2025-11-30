<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            // Primary key untuk tabel users (ID unik pengguna)
            $table->string('id_user', 20)->primary();
            
            // Data pribadi pengguna
            $table->string('name'); // Nama lengkap pengguna
            $table->string('email')->unique(); // Email pengguna (harus unik)
            $table->timestamp('email_verified_at')->nullable(); // Waktu verifikasi email (nullable)
            
            // Data autentikasi
            $table->string('password'); // Password yang sudah di-hash
            $table->rememberToken(); // Token untuk fitur "remember me"
            
            // Role dan status pengguna
            $table->enum('role', ['admin', 'mentor', 'member'])->default('member'); // Peran: admin, mentor, atau member
            $table->enum('status', ['active', 'inactive', 'pending'])->default('active'); // Status akun: aktif, tidak aktif, atau pending
            
            // Timestamp untuk tracking waktu pembuatan dan update
            $table->timestamps();
        });

        // Tabel untuk reset password (Laravel default)
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary(); // Email yang meminta reset password
            $table->string('token'); // Token untuk reset password
            $table->timestamp('created_at')->nullable(); // Waktu token dibuat
        });

        // Tabel untuk session management (Laravel default)
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary(); // ID session unik
            $table->string('user_id', 20)->nullable()->index(); // ID user yang login (nullable untuk guest)
            $table->string('ip_address', 45)->nullable(); // IP address pengguna
            $table->text('user_agent')->nullable(); // Browser/device info
            $table->longText('payload'); // Data session
            $table->integer('last_activity')->index(); // Waktu aktivitas terakhir
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};


