<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Bimbingan\DashboardController;
use App\Http\Controllers\Bimbingan\BimbinganSyncController;
use App\Http\Controllers\Management\Configuration\MenuController;
use App\Http\Controllers\Management\Configuration\RoleController;
use App\Http\Controllers\Management\Configuration\PermissionController;
use App\Http\Controllers\Management\Configuration\AccessRoleController;
use App\Http\Controllers\Management\Configuration\AccessUserController;
use App\Http\Controllers\Management\Configuration\UserController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/demo', function () {
    return Inertia::render('demo');
})->name('demo');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('bimbingan/upload-sk', [DashboardController::class, 'uploadSK'])->name('bimbingan.upload-sk');

    Route::prefix('bimbingan/sync')->name('bimbingan.sync.')->group(function () {
        Route::post('proposals', [BimbinganSyncController::class, 'syncProposals'])->name('proposals');
        Route::post('proposal-titles', [BimbinganSyncController::class, 'syncProposalTitles'])->name('proposal-titles');
        Route::post('theses', [BimbinganSyncController::class, 'syncTheses'])->name('theses');
        Route::post('guidances', [BimbinganSyncController::class, 'syncGuidances'])->name('guidances');
        Route::post('event-types', [BimbinganSyncController::class, 'syncEventTypes'])->name('event-types');
        Route::post('availability-rules', [BimbinganSyncController::class, 'syncAvailabilityRules'])->name('availability-rules');
        Route::post('bookings', [BimbinganSyncController::class, 'syncBookings'])->name('bookings');
        Route::post('users', [BimbinganSyncController::class, 'syncUsers'])->name('users');
    });

    Route::prefix('configuration')->name('configuration.')->group(function () {
        Route::resource('menu', MenuController::class);
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
        Route::resource('access-role', AccessRoleController::class)->except(['create', 'store', 'delete'])->parameters(['access-role' => 'role']);
        Route::resource('access-user', AccessUserController::class)->except(['create', 'store', 'delete'])->parameters(['access-user' => 'user']);
        Route::patch('/users/{user}/approve', [UserController::class, 'approve'])->name('users.approve');
        Route::delete('/users/{email}/sessions', [UserController::class, 'destroySessions'])->name('users.destroy-sessions');
        Route::resource('users', UserController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
