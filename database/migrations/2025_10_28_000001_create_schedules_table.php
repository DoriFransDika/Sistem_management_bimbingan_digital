<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            // Primary key untuk tabel schedules
            $table->string('Id_schedles', 20)->primary();

            // Relasi ke member dan mentor
            $table->string('member_id', 20);
            $table->string('mentor_id', 20);
            $table->foreign('member_id')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('mentor_id')->references('id_user')->on('users')->onDelete('cascade');

            // Relasi ke specializations dan materi
            $table->string('Id_specializations', 20);
            $table->foreign('Id_specializations')->references('Id_specializations')->on('specializations');

            // Relasi ke tabel materi (foreign key)
            $table->string('materi_id', 20)->nullable();
            $table->foreign('materi_id')->references('id_materi')->on('materi')->onDelete('set null');

            // Data jadwal yang diusulkan
            $table->date('proposed_date');
            $table->time('proposed_time')->default('09:00:00');

            // Status jadwal
            $table->enum('status', [
                'pending_approval',
                'approved',
                'pending_admin_verification',
                'rejected',
                'confirmed',
                'completed'
            ])->default('pending_approval');

            $table->text('rejection_reason')->nullable();

            // Data materi & laporan
            $table->string('materi_modul')->nullable();
            $table->string('materi_topik')->nullable();
            $table->text('materi_sub_topik')->nullable();
            $table->text('dokumentasi')->nullable();
            $table->timestamp('laporan_dikirim_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};













