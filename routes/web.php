<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/demo', function () {
    return Inertia::render('demo');
})->name('demo');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Bimbingan\DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('bimbingan/sync')->name('bimbingan.sync.')->group(function () {
        Route::post('proposals', [\App\Http\Controllers\Bimbingan\BimbinganSyncController::class, 'syncProposals'])->name('proposals');
        Route::post('proposal-titles', [\App\Http\Controllers\Bimbingan\BimbinganSyncController::class, 'syncProposalTitles'])->name('proposal-titles');
        Route::post('theses', [\App\Http\Controllers\Bimbingan\BimbinganSyncController::class, 'syncTheses'])->name('theses');
        Route::post('guidances', [\App\Http\Controllers\Bimbingan\BimbinganSyncController::class, 'syncGuidances'])->name('guidances');
        Route::post('event-types', [\App\Http\Controllers\Bimbingan\BimbinganSyncController::class, 'syncEventTypes'])->name('event-types');
        Route::post('availability-rules', [\App\Http\Controllers\Bimbingan\BimbinganSyncController::class, 'syncAvailabilityRules'])->name('availability-rules');
        Route::post('bookings', [\App\Http\Controllers\Bimbingan\BimbinganSyncController::class, 'syncBookings'])->name('bookings');
        Route::post('users', [\App\Http\Controllers\Bimbingan\BimbinganSyncController::class, 'syncUsers'])->name('users');
    });

    Route::prefix('configuration')->name('configuration.')->group(function () {
        Route::resource('menu', \App\Http\Controllers\Management\Configuration\MenuController::class);
        Route::resource('roles', \App\Http\Controllers\Management\Configuration\RoleController::class);
        Route::resource('permissions', \App\Http\Controllers\Management\Configuration\PermissionController::class);
        Route::resource('access-role', \App\Http\Controllers\Management\Configuration\AccessRoleController::class)->except(['create', 'store', 'delete'])->parameters(['access-role' => 'role']);
        Route::resource('access-user', \App\Http\Controllers\Management\Configuration\AccessUserController::class)->except(['create', 'store', 'delete'])->parameters(['access-user' => 'user']);
        Route::patch('/users/{user}/approve', [\App\Http\Controllers\Management\Configuration\UserController::class, 'approve'])->name('users.approve');
        Route::delete('/users/{email}/sessions', [\App\Http\Controllers\Management\Configuration\UserController::class, 'destroySessions'])->name('users.destroy-sessions');
        Route::resource('users', \App\Http\Controllers\Management\Configuration\UserController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
