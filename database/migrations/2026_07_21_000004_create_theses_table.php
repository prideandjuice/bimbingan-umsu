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
        Schema::create('theses', function (Blueprint $table) {
            $table->string('id')->primary(); // matching frontend
            $table->foreignId('proposal_id')->nullable()->constrained('title_submissions')->onDelete('set null');
            $table->foreignId('title_submission_id')->nullable()->constrained('title_submissions')->onDelete('set null');
            $table->text('title');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->string('status')->default('pending_supervisor'); // pending_supervisor, in_progress, completed
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('theses');
    }
};
