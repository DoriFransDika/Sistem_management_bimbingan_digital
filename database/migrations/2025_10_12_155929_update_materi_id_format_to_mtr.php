<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update format ID materi dari MT menjadi MTR untuk konsistensi
        DB::statement("
            UPDATE materi 
            SET id_materi = CONCAT('MTR', SUBSTRING(id_materi, 3))
            WHERE id_materi REGEXP '^[Mm][Tt][0-9]+$'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to MT format
        DB::statement("
            UPDATE materi 
            SET id_materi = CONCAT('MT', SUBSTRING(id_materi, 4))
            WHERE id_materi REGEXP '^[Mm][Tt][Rr][0-9]+$'
        ");
    }
};
