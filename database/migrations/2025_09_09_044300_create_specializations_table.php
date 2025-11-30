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
    Schema::create('specializations', function (Blueprint $table) {
        // Primary key untuk tabel specializations
        $table->string('Id_specializations', 20)->primary();
        
        // Nama spesialisasi (Web Programming, Graphic Design, dll)
        $table->string('name')->unique();
        
        // Timestamp untuk tracking waktu pembuatan dan update
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('specializations');
    }
};
