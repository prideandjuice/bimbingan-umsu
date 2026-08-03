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
        Schema::table('availabilities', function (Blueprint $table) {
            if (Schema::hasColumn('availabilities', 'day_of_week')) {
                $table->dropColumn('day_of_week');
            }
            if (Schema::hasColumn('availabilities', 'start_time')) {
                $table->dropColumn('start_time');
            }
            if (Schema::hasColumn('availabilities', 'end_time')) {
                $table->dropColumn('end_time');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('availabilities', function (Blueprint $table) {
            $table->integer('day_of_week')->nullable();
            $table->string('start_time')->nullable();
            $table->string('end_time')->nullable();
        });
    }
};
