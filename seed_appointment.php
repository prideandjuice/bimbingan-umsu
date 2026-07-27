<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Thesis;
use App\Models\Appointment;

$lecturer = User::whereHas('roles', function($q) {
    $q->where('name', 'lecturer');
})->first() ?? User::first();

$student = User::whereHas('roles', function($q) {
    $q->where('name', 'student');
})->first() ?? User::latest()->first();

$thesis = Thesis::where('student_id', $student?->id)->first() ?? Thesis::first();

if (!$thesis) {
    $thesis = Thesis::create([
        'id' => 'thesis-demo-1',
        'proposal_id' => 'prop-demo-1',
        'student_id' => $student->id,
        'title' => 'Analisis Pola Komunikasi Organisasi',
        'status' => 'APPROVED',
        'metadata' => [
            'supervisors' => [
                'current' => [
                    'supervisor_1' => $lecturer->id,
                ]
            ]
        ]
    ]);
}

if ($lecturer && $student && $thesis) {
    Appointment::updateOrCreate(
        ['id' => 'booking-demo-1'],
        [
            'thesis_id' => $thesis->id,
            'student_id' => $student->id,
            'lecturer_id' => $lecturer->id,
            'date' => '2026-07-28',
            'time_slot' => '09:00 - 12:00',
            'status' => 'pending',
            'notes' => 'Pengajuan konsultasi bimbingan Bab 2 dan instrumen kuesioner',
        ]
    );
    echo "Appointment seeded successfully! Lecturer ID: " . $lecturer->id . " - Student ID: " . $student->id . " - Thesis ID: " . $thesis->id . "\n";
} else {
    echo "Lecturer or student or thesis not found.\n";
}
