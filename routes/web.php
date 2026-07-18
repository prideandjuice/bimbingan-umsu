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
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

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
