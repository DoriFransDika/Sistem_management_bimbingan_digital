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
        Schema::create('materi', function (Blueprint $table) {
            // Primary key untuk tabel materi
            $table->string('id_materi', 20)->primary();
            
            // Data materi pelatihan
            $table->string('modul'); // Nama modul pelatihan
            $table->integer('pertemuan'); // Nomor pertemuan
            $table->string('topik'); // Topik utama materi
            $table->text('sub_topik'); // Sub topik detail materi
            
            // Timestamp untuk tracking waktu pembuatan dan update
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materi');
    }
};