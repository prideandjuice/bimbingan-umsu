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
        Schema::create('guidance_sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('thesis_id');
            $table->foreign('thesis_id')->references('id')->on('theses')->onDelete('cascade');
            $table->string('appointment_id')->nullable();
            $table->foreign('appointment_id')->references('id')->on('appointments')->onDelete('set null');
            $table->integer('meeting_no')->nullable();
            $table->string('result')->nullable();
            $table->string('date');
            $table->text('notes');
            $table->text('revisions')->nullable();
            $table->integer('progress');
            $table->string('created_by');
            $table->string('creator_name');
            $table->string('status')->default('pending_verification');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guidance_sessions');
    }
};
