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
        Schema::create('mentor_available_days', function (Blueprint $table) {
            // Pivot table untuk relasi many-to-many antara mentor dan available days
            
            // Foreign keys
            $table->string('user_id', 20); // ID mentor
            $table->string('Id_day', 20); // ID hari tersedia
            
            // Composite primary key
            $table->primary(['user_id', 'Id_day']);
            
            // Foreign key constraints
            $table->foreign('user_id')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('Id_day')->references('Id_day')->on('available_days')->onDelete('cascade');
            
            // Timestamp untuk tracking waktu pembuatan dan update
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentor_available_days');
    }
};
