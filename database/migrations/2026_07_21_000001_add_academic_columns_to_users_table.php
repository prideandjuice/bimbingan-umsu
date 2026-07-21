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
        Schema::table('users', function (Blueprint $table) {
            $table->string('npm')->nullable()->after('email');
            $table->string('nidn')->nullable()->after('npm');
            $table->string('department')->nullable()->after('nidn');
            $table->boolean('is_verified')->default(false)->after('department');
            $table->string('identity_number')->nullable()->after('is_verified');
            $table->string('user_type')->nullable()->after('identity_number');
            $table->json('metadata')->nullable()->after('user_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['npm', 'nidn', 'department', 'is_verified', 'identity_number', 'user_type', 'metadata']);
        });
    }
};
