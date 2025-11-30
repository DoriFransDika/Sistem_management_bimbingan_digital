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
        Schema::create('mentor_specializations', function (Blueprint $table) {
            // Pivot table untuk relasi many-to-many antara mentor dan specializations
            
            // Foreign keys
            $table->string('user_id', 20); // ID mentor
            $table->string('Id_specializations', 20); // ID spesialisasi
            
            // Composite primary key
            $table->primary(['user_id', 'Id_specializations']);
            
            // Foreign key constraints
            $table->foreign('user_id')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('Id_specializations')->references('Id_specializations')->on('specializations')->onDelete('cascade');
            
            // Timestamp untuk tracking waktu pembuatan dan update
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentor_specializations');
    }
};
