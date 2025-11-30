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
    Schema::create('meetings', function (Blueprint $table) {
        // Primary key auto increment
        $table->id();
        
        // Relasi ke member dan mentor
        $table->string('member_id', 20);
        $table->string('mentor_id', 20);
        $table->foreign('member_id')->references('id_user')->on('users')->onDelete('cascade');
        $table->foreign('mentor_id')->references('id_user')->on('users')->onDelete('cascade');

        // Data jadwal pertemuan
        $table->datetime('schedule'); // Waktu dan tanggal pertemuan
        $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending'); // Status pertemuan
        $table->string('topic'); // Topik yang akan dibahas

        // Data tambahan pertemuan
        $table->text('notes')->nullable(); // Catatan pertemuan
        $table->text('feedback')->nullable(); // Feedback dari mentor/member
        $table->integer('rating')->nullable(); // Rating pertemuan (1-5)
        
        // Timestamp untuk tracking waktu pembuatan dan update
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
