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
        Schema::table('proposal_titles', function (Blueprint $table) {
            if (!Schema::hasColumn('proposal_titles', 'sk_file')) {
                $table->string('sk_file')->nullable()->after('notes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proposal_titles', function (Blueprint $table) {
            if (Schema::hasColumn('proposal_titles', 'sk_file')) {
                $table->dropColumn('sk_file');
            }
        });
    }
};
