<?php

use App\Http\Controllers\Bimbingan\BimbinganSyncController;
use App\Http\Controllers\Bimbingan\DashboardController;
use App\Http\Controllers\Management\Configuration\AccessRoleController;
use App\Http\Controllers\Management\Configuration\AccessUserController;
use App\Http\Controllers\Management\Configuration\MenuController;
use App\Http\Controllers\Management\Configuration\PermissionController;
use App\Http\Controllers\Management\Configuration\RoleController;
use App\Http\Controllers\Management\Configuration\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/demo', function () {
    return Inertia::render('demo');
})->name('demo');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('bimbingan/upload-draft', [DashboardController::class, 'uploadDraft'])->name('bimbingan.upload-draft');

    // Route Khusus Mahasiswa
    Route::middleware(['role:student'])->group(function () {
        Route::get('mahasiswa/{tab?}', [DashboardController::class, 'index'])->name('mahasiswa.index');
    });

    // Route Khusus Dosen
    Route::middleware(['role:lecturer'])->group(function () {
        Route::get('dosen/{tab?}', [DashboardController::class, 'index'])->name('dosen.index');
    });

    // Route Khusus Kaprodi & Admin
    Route::middleware(['role:prodi,admin'])->group(function () {
        Route::get('kaprodi/{tab?}', [DashboardController::class, 'index'])->name('kaprodi.index');
        Route::post('bimbingan/upload-sk', [DashboardController::class, 'uploadSK'])->name('bimbingan.upload-sk');

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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// Route Halaman Booking publik (Diletakkan paling akhir agar rute sistem seperti /settings/profile dievaluasi duluan)
Route::get('bimbingan/{slug}', [DashboardController::class, 'bookingSlugPage'])->name('bimbingan.booking-slug-legacy');
Route::get('{lecturerUsername}/{slug}', [DashboardController::class, 'bookingSlugPage'])
    ->where('lecturerUsername', '^(?!(dosen|mahasiswa|kaprodi|dashboard|configuration|settings|auth|demo|bimbingan)$).*')
    ->name('bimbingan.booking-slug');
