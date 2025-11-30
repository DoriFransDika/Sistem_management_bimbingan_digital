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
        // 1. Tambahkan kolom JSON untuk menyimpan multiple specializations dan days
        Schema::table('mentor_profiles', function (Blueprint $table) {
            $table->json('specialization_ids')->nullable()->after('Id_specializations'); // Array ID spesialisasi
            $table->json('available_day_ids')->nullable()->after('Id_day'); // Array ID hari tersedia
        });

        // 2. Migrate data dari pivot tables ke kolom JSON
        DB::statement("
            UPDATE mentor_profiles mp
            SET specialization_ids = (
                SELECT JSON_ARRAYAGG(ms.Id_specializations)
                FROM mentor_specializations ms
                WHERE ms.user_id = mp.user_id
            )
        ");

        DB::statement("
            UPDATE mentor_profiles mp
            SET available_day_ids = (
                SELECT JSON_ARRAYAGG(mad.Id_day)
                FROM mentor_available_days mad
                WHERE mad.user_id = mp.user_id
            )
        ");

        // 3. Hapus kolom lama yang sudah tidak diperlukan
        Schema::table('mentor_profiles', function (Blueprint $table) {
            $table->dropForeign(['Id_specializations']);
            $table->dropColumn('Id_specializations');
            $table->dropForeign(['Id_day']);
            $table->dropColumn('Id_day');
        });

        // 4. Hapus pivot tables karena sudah tidak diperlukan
        Schema::dropIfExists('mentor_specializations');
        Schema::dropIfExists('mentor_available_days');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate pivot tables
        Schema::create('mentor_specializations', function (Blueprint $table) {
            $table->string('user_id', 20);
            $table->string('Id_specializations', 20);
            $table->timestamps();
            
            $table->primary(['user_id', 'Id_specializations']);
            $table->foreign('user_id')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('Id_specializations')->references('Id_specializations')->on('specializations')->onDelete('cascade');
        });

        Schema::create('mentor_available_days', function (Blueprint $table) {
            $table->string('user_id', 20);
            $table->string('Id_day', 20);
            $table->timestamps();
            
            $table->primary(['user_id', 'Id_day']);
            $table->foreign('user_id')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('Id_day')->references('Id_day')->on('available_days')->onDelete('cascade');
        });

        // Restore old columns
        Schema::table('mentor_profiles', function (Blueprint $table) {
            $table->string('Id_specializations', 20)->nullable();
            $table->string('Id_day', 20)->nullable();
            $table->foreign('Id_specializations')->references('Id_specializations')->on('specializations')->nullOnDelete();
            $table->foreign('Id_day')->references('Id_day')->on('available_days')->nullOnDelete();
        });

        // Drop JSON columns
        Schema::table('mentor_profiles', function (Blueprint $table) {
            $table->dropColumn(['specialization_ids', 'available_day_ids']);
        });
    }
};
