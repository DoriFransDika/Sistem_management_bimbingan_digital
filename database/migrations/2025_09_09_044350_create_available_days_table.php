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
        Schema::create('available_days', function (Blueprint $table) {
            // Primary key untuk tabel available days
            $table->string('Id_day', 20)->primary();
            
            // Nama hari dalam seminggu (Senin, Selasa, Rabu, dll)
            $table->string('name')->unique();
            
            // Urutan hari untuk sorting (1=Senin, 2=Selasa, dst)
            $table->integer('sort_order')->default(0);
            
            // Tidak perlu timestamps untuk data statis
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('available_days');
    }
};