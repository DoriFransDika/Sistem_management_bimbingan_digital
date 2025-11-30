<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_history', function (Blueprint $table) {
            $table->id();

            // Relasi ke schedule, member, dan mentor
            $table->string('schedule_id', 20);
            $table->foreign('schedule_id')->references('Id_schedles')->on('schedules')->onDelete('cascade');
            $table->string('member_id', 20);
            $table->string('mentor_id', 20);
            $table->foreign('member_id')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('mentor_id')->references('id_user')->on('users')->onDelete('cascade');

            // Data jenis pelatihan
            $table->enum('training_type', [
                'Administrasi Perkantoran',
                'Graphic Design',
                'Web Programming Basic',
                'UI/UX Design'
            ]);

            // Data jadwal pertemuan
            $table->date('meeting_date');
            $table->time('meeting_time');
            $table->enum('meeting_type', ['Luring', 'Daring']);

            // Data tambahan pertemuan
            $table->string('meeting_link')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['completed', 'cancelled'])->default('completed');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_history');
    }
};













