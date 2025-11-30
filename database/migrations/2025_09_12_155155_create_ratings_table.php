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
            Schema::create('ratings', function (Blueprint $table) {
                // Primary key untuk tabel ratings
                $table->string('id_rating', 20)->primary();
                
                // Relasi ke mentor dan member
                $table->string('mentor_id', 20);
                $table->string('member_id', 20);
                $table->foreign('mentor_id')->references('id_user')->on('users')->onDelete('cascade');
                $table->foreign('member_id')->references('id_user')->on('users')->onDelete('cascade');
                
                // Data rating dan review
                $table->tinyInteger('rating')->unsigned(); // Nilai rating 1-5
                $table->text('review')->nullable(); // Ulasan teks dari member
                
                // Timestamp untuk tracking waktu pembuatan dan update
                $table->timestamps();
            });
        }

    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
