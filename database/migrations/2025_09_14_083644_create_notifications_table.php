<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            // Primary key auto increment
            $table->id();
            
            // Data notifikasi
            $table->string('type'); // Jenis notifikasi (schedule_confirmed, report_approved, dll)
            $table->string('title'); // Judul notifikasi
            $table->text('message'); // Pesan notifikasi
            $table->json('data')->nullable(); // Data tambahan untuk notifikasi
            
            // Status notifikasi
            $table->boolean('is_read')->default(false); // Status sudah dibaca atau belum
            $table->timestamp('read_at')->nullable(); // Waktu notifikasi dibaca
            
            // Timestamp untuk tracking waktu pembuatan dan update
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
