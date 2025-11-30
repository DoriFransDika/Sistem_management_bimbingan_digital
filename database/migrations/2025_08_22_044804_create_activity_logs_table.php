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
        Schema::create('activity_logs', function (Blueprint $table) {
            // Primary key auto increment
            $table->id();
            
            // Relasi ke user yang melakukan aktivitas
            $table->string('user_id', 20);
            $table->foreign('user_id')->references('id_user')->on('users')->onDelete('cascade');
            
            // Data aktivitas yang dilakukan
            $table->string('action'); // Jenis aksi (create, update, delete, dll)
            $table->text('description')->nullable(); // Deskripsi detail aktivitas
            
            // Data model yang terpengaruh (polymorphic)
            $table->string('model_type')->nullable(); // Tipe model (User, Schedule, dll)
            $table->string('model_id')->nullable(); // ID model yang terpengaruh
            
            // Timestamp untuk tracking waktu pembuatan dan update
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
