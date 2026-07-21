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
        Schema::create('availabilities', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('lecturer_id')->constrained('users')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->boolean('is_default')->default(false);
            $table->json('rules')->nullable();
            $table->integer('day_of_week');
            $table->string('start_time');
            $table->string('end_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('availabilities');
    }
};
