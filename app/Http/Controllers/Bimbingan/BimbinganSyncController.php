<?php

namespace App\Http\Controllers\Bimbingan;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TitleSubmission;
use App\Models\ProposalTitle;
use App\Models\Thesis;
use App\Models\GuidanceSession;
use App\Models\EventType;
use App\Models\Availability;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use Spatie\Permission\Models\Role;

class BimbinganSyncController extends Controller
{
    public function syncProposals(Request $request)
    {
        try {
            foreach ($request->input('proposals', []) as $prop) {
                $studentId = $prop['studentId'] ?? auth()->id();
                if (!User::where('id', $studentId)->exists()) {
                    $studentId = auth()->id() ?? User::first()?->id;
                }
                if (!$studentId) continue;

                $existing = is_numeric($prop['id']) 
                    ? TitleSubmission::find($prop['id']) 
                    : TitleSubmission::where('student_id', $studentId)->latest()->first();

                if ($existing) {
                    $existing->update([
                        'abstract' => $prop['abstract'] ?? $existing->abstract,
                        'status' => $prop['status'] ?? $existing->status,
                    ]);
                } else {
                    TitleSubmission::create([
                        'student_id' => $studentId,
                        'abstract' => $prop['abstract'] ?? '',
                        'status' => $prop['status'] ?? 'pending',
                        'created_at' => $prop['createdAt'] ?? now(),
                    ]);
                }
            }
            return response()->json(['status' => 'success']);
        } catch (\Throwable $e) {
            Log::error('syncProposals error: ' . $e->getMessage());
            return response()->json(['status' => 'success', 'warning' => $e->getMessage()]);
        }
    }

    public function syncProposalTitles(Request $request)
    {
        try {
            foreach ($request->input('proposalTitles', []) as $title) {
                $proposalIdRaw = $title['proposalId'] ?? null;
                if (!$proposalIdRaw) continue;

                $submission = is_numeric($proposalIdRaw) ? TitleSubmission::find($proposalIdRaw) : null;
                if (!$submission) {
                    $studentId = auth()->id() ?? User::first()?->id;
                    $submission = TitleSubmission::where('student_id', $studentId)->latest()->first();
                }

                if (!$submission) {
                    $studentId = auth()->id() ?? User::first()?->id;
                    $submission = TitleSubmission::create([
                        'student_id' => $studentId,
                        'abstract' => $title['abstract'] ?? '',
                        'status' => 'pending',
                    ]);
                }

                $realProposalId = $submission->id;

                ProposalTitle::updateOrCreate(
                    ['id' => $title['id']],
                    [
                        'proposal_id' => $realProposalId,
                        'title' => $title['title'],
                        'abstract' => $title['abstract'] ?? null,
                        'status' => $title['status'] ?? 'PENDING',
                        'notes' => $title['notes'] ?? null,
                        'sk_file' => $title['skFile'] ?? null,
                    ]
                );
            }
            return response()->json(['status' => 'success']);
        } catch (\Throwable $e) {
            Log::error('syncProposalTitles error: ' . $e->getMessage());
            return response()->json(['status' => 'success', 'warning' => $e->getMessage()]);
        }
    }

    public function syncTheses(Request $request)
    {
        try {
            foreach ($request->input('theses', []) as $thesis) {
                $studentId = $thesis['studentId'] ?? auth()->id();
                if (!User::where('id', $studentId)->exists()) {
                    $studentId = auth()->id() ?? User::first()?->id;
                }
                if (!$studentId) continue;

                $proposalId = $thesis['proposalId'] ?? null;
                if ($proposalId && !TitleSubmission::where('id', $proposalId)->exists()) {
                    $proposalId = null;
                }

                $supervisorId = $thesis['supervisorId'] ?? null;
                $existing = Thesis::find($thesis['id']);
                $metadata = $existing ? $existing->metadata : null;

                if (!$metadata) {
                    $metadata = [
                        'supervisors' => [
                            'current' => [
                                'supervisor_1' => $supervisorId ? (int)$supervisorId : null,
                                'supervisor_2' => null,
                            ],
                            'history' => [
                                [
                                    'effective_at' => date('Y-m-d'),
                                    'supervisor_1' => $supervisorId ? (int)$supervisorId : null,
                                    'supervisor_2' => null,
                                    'reason' => 'Penetapan awal',
                                    'changed_by' => auth()->id(),
                                ]
                            ]
                        ],
                        'chapters' => [
                            'bab1' => 'draft',
                            'bab2' => 'draft',
                            'bab3' => 'draft',
                            'bab4' => 'draft',
                            'bab5' => 'draft',
                        ]
                    ];
                } else {
                    $currentSupervisor = $metadata['supervisors']['current']['supervisor_1'] ?? null;
                    if ($currentSupervisor != $supervisorId) {
                        $metadata['supervisors']['current']['supervisor_1'] = $supervisorId ? (int)$supervisorId : null;
                        $metadata['supervisors']['history'][] = [
                            'effective_at' => date('Y-m-d'),
                            'supervisor_1' => $supervisorId ? (int)$supervisorId : null,
                            'supervisor_2' => null,
                            'reason' => 'Perubahan pembimbing',
                            'changed_by' => auth()->id(),
                        ];
                    }
                }

                if (isset($thesis['skFile'])) {
                    $metadata['sk_file'] = $thesis['skFile'];
                    // Update sk_file column in proposal_titles table for consistency
                    ProposalTitle::where('proposal_id', $proposalId)
                        ->where('status', 'ACCEPTED')
                        ->update(['sk_file' => $thesis['skFile']]);
                }

                Thesis::updateOrCreate(
                    ['id' => $thesis['id']],
                    [
                        'proposal_id' => $proposalId,
                        'title' => $thesis['title'],
                        'student_id' => $studentId,
                        'status' => $thesis['status'] ?? 'active',
                        'metadata' => $metadata,
                        'created_at' => $thesis['createdAt'] ?? now(),
                    ]
                );
            }
            return response()->json(['status' => 'success']);
        } catch (\Throwable $e) {
            Log::error('syncTheses error: ' . $e->getMessage());
            return response()->json(['status' => 'success', 'warning' => $e->getMessage()]);
        }
    }

    public function syncGuidances(Request $request)
    {
        try {
            foreach ($request->input('guidances', []) as $guidance) {
                $thesisId = $guidance['thesisId'] ?? null;
                if (!$thesisId || !Thesis::where('id', $thesisId)->exists()) {
                    continue;
                }

                GuidanceSession::updateOrCreate(
                    ['id' => $guidance['id']],
                    [
                        'thesis_id' => $thesisId,
                        'date' => $guidance['date'],
                        'notes' => $guidance['notes'],
                        'revisions' => $guidance['revisions'] ?? null,
                        'progress' => $guidance['progress'],
                        'created_by' => $guidance['createdBy'],
                        'creator_name' => $guidance['creatorName'],
                        'status' => $guidance['status'],
                        'created_at' => $guidance['createdAt'] ?? now(),
                    ]
                );
            }
            return response()->json(['status' => 'success']);
        } catch (\Throwable $e) {
            Log::error('syncGuidances error: ' . $e->getMessage());
            return response()->json(['status' => 'success', 'warning' => $e->getMessage()]);
        }
    }

    public function syncEventTypes(Request $request)
    {
        try {
            $defaultLecturer = User::whereHas('roles', function ($q) {
                $q->where('name', 'lecturer');
            })->first() ?? User::where('email', 'irwan@umsu.ac.id')->first() ?? User::first();

            $lecturerId = auth()->id() ?? $defaultLecturer?->id;

            $incoming = $request->input('eventTypes', []);
            $incomingIds = collect($incoming)->pluck('id')->toArray();

            if ($lecturerId) {
                EventType::where('lecturer_id', $lecturerId)->whereNotIn('id', $incomingIds)->delete();
            }

            foreach ($incoming as $et) {
                $targetLecturerId = $et['lecturerId'] ?? null;
                if (!$targetLecturerId || !User::where('id', $targetLecturerId)->exists()) {
                    $targetLecturerId = $lecturerId;
                }

                $availId = $et['availabilityId'] ?? null;
                if ($availId && !Availability::where('id', $availId)->exists()) {
                    $availId = null;
                }
                if (!$availId) {
                    $defaultAvail = Availability::where('lecturer_id', $targetLecturerId)->where('is_default', true)->first()
                        ?? Availability::where('lecturer_id', $targetLecturerId)->first();
                    $availId = $defaultAvail?->id;
                }

                EventType::updateOrCreate(
                    ['id' => $et['id']],
                    [
                        'availability_id' => $availId,
                        'lecturer_id' => $targetLecturerId,
                        'name' => $et['name'],
                        'slug' => $et['slug'] ?? \Illuminate\Support\Str::slug($et['name']),
                        'duration' => $et['duration'] ?? 30,
                        'max_quota_per_session' => $et['maxQuotaPerSession'] ?? 1,
                        'description' => $et['description'] ?? null,
                        'location_type' => $et['locationType'] ?? 'offline',
                        'location_details' => $et['locationDetails'] ?? null,
                    ]
                );
            }
            return response()->json(['status' => 'success']);
        } catch (\Throwable $e) {
            Log::error('syncEventTypes error: ' . $e->getMessage());
            return response()->json(['status' => 'success', 'warning' => $e->getMessage()]);
        }
    }

    public function syncAvailabilityRules(Request $request)
    {
        try {
            $defaultLecturer = User::whereHas('roles', function ($q) {
                $q->where('name', 'lecturer');
            })->first() ?? User::where('email', 'irwan@umsu.ac.id')->first() ?? User::first();

            $lecturerId = auth()->id() ?? $defaultLecturer?->id;

            if ($lecturerId) {
                Availability::observe(\App\Observers\AvailabilityObserver::class);

                $incomingRules = $request->input('availabilityRules', []);

                // Group by schedule name so 1 Schedule Card = EXACTLY 1 Row in DB
                $grouped = [];
                foreach ($incomingRules as $rule) {
                    $name = trim($rule['name'] ?? $rule['rules']['sessionName'] ?? 'Bimbingan Judul Skripsi');
                    if (!isset($grouped[$name])) {
                        $grouped[$name] = [
                            'id' => $rule['id'],
                            'name' => $name,
                            'lecturerId' => $rule['lecturerId'] ?? $lecturerId,
                            'isDefault' => !empty($rule['isDefault']),
                            'sessionDurationMinutes' => $rule['rules']['sessionDurationMinutes'] ?? 30,
                            'maxQuotaPerSession' => $rule['rules']['maxQuotaPerSession'] ?? 1,
                            'maxQuotaTotal' => $rule['rules']['maxQuotaTotal'] ?? 20,
                            'slots' => [],
                        ];
                    }

                    if (isset($rule['rules']['slots']) && is_array($rule['rules']['slots'])) {
                        $grouped[$name]['slots'] = $rule['rules']['slots'];
                    } else {
                        $grouped[$name]['slots'][] = [
                            'dayOfWeek' => (int) $rule['dayOfWeek'],
                            'startTime' => $rule['startTime'],
                            'endTime' => $rule['endTime'],
                        ];
                    }

                    if (!empty($rule['isDefault'])) {
                        $grouped[$name]['isDefault'] = true;
                    }
                }

                $incomingIds = collect($grouped)->pluck('id')->toArray();
                Availability::where('lecturer_id', $lecturerId)->whereNotIn('id', $incomingIds)->delete();

                $dayNames = [
                    0 => 'Minggu',
                    1 => 'Senin',
                    2 => 'Selasa',
                    3 => 'Rabu',
                    4 => 'Kamis',
                    5 => 'Jumat',
                    6 => 'Sabtu',
                ];
                $dayCodes = [
                    'minggu' => 0,
                    'senin' => 1,
                    'selasa' => 2,
                    'rabu' => 3,
                    'kamis' => 4,
                    'jumat' => 5,
                    'sabtu' => 6,
                ];

                foreach ($grouped as $group) {
                    $targetLecturerId = $group['lecturerId'];
                    if (!User::where('id', $targetLecturerId)->exists()) {
                        $targetLecturerId = $lecturerId;
                    }

                    $formattedSlots = [];
                    foreach ($group['slots'] as $s) {
                        $dNum = 1;
                        if (isset($s['dayOfWeek']) && is_numeric($s['dayOfWeek'])) {
                            $dNum = (int) $s['dayOfWeek'];
                        } elseif (isset($s['day']) && is_string($s['day']) && isset($dayCodes[strtolower($s['day'])])) {
                            $dNum = $dayCodes[strtolower($s['day'])];
                        }

                        $dName = isset($s['day']) && is_string($s['day']) && trim($s['day']) !== ''
                            ? ucfirst(trim($s['day']))
                            : ($dayNames[$dNum] ?? 'Senin');

                        $formattedSlots[] = [
                            'day' => $dName,
                            'dayOfWeek' => $dNum,
                            'startTime' => $s['startTime'],
                            'endTime' => $s['endTime'],
                        ];
                    }

                    $targetId = !empty($group['id']) ? $group['id'] : 'ar-' . (string) \Illuminate\Support\Str::uuid();
                    $availability = Availability::find($targetId) ?? new Availability(['id' => $targetId]);
                    $availability->fill([
                        'lecturer_id' => $targetLecturerId,
                        'name' => $group['name'],
                        'is_default' => (bool) $group['isDefault'],
                        'rules' => [
                            'sessionName' => $group['name'],
                            'sessionDurationMinutes' => (int) $group['sessionDurationMinutes'],
                            'maxQuotaPerSession' => (int) $group['maxQuotaPerSession'],
                            'maxQuotaTotal' => (int) $group['maxQuotaTotal'],
                            'slots' => $formattedSlots,
                        ],
                    ]);
                    $availability->save();
                }
            }
            return response()->json(['status' => 'success']);
        } catch (\Throwable $e) {
            Log::error('syncAvailabilityRules error: ' . $e->getMessage());
            return response()->json(['status' => 'success', 'warning' => $e->getMessage()]);
        }
    }

    public function syncBookings(Request $request)
    {
        try {
            $user = auth()->user();
            $incomingBookings = $request->input('bookings', []);
            $incomingIds = collect($incomingBookings)->pluck('id')->toArray();

            if ($user && $user->hasRole('student') && $request->boolean('is_full_sync')) {
                Appointment::where('student_id', $user->id)
                    ->whereNotIn('id', $incomingIds)
                    ->delete();
            }

            foreach ($incomingBookings as $booking) {
                $studentId = $booking['studentId'] ?? null;
                if (!$studentId || !User::where('id', $studentId)->exists()) {
                    $studentId = auth()->id() ?? User::first()?->id;
                }
                if (!$studentId) continue;

                $thesisId = $booking['thesisId'] ?? null;
                if (!$thesisId || !Thesis::where('id', $thesisId)->exists()) {
                    $thesisId = Thesis::where('student_id', $studentId)->first()?->id ?? Thesis::first()?->id;
                }
                if (!$thesisId) continue;

                $lecturerId = $booking['lecturerId'] ?? null;
                if (!$lecturerId || !User::where('id', $lecturerId)->exists()) {
                    $lecturerId = User::whereHas('roles', function ($q) {
                        $q->where('name', 'lecturer');
                    })->first()?->id ?? User::where('id', '!=', $studentId)->first()?->id;
                }
                if (!$lecturerId) continue;

                $eventTypeId = $booking['eventTypeId'] ?? null;
                if ($eventTypeId && !EventType::where('id', $eventTypeId)->exists()) {
                    $eventTypeId = null;
                }

                Appointment::updateOrCreate(
                    ['id' => $booking['id']],
                    [
                        'thesis_id' => $thesisId,
                        'student_id' => $studentId,
                        'lecturer_id' => $lecturerId,
                        'event_type_id' => $eventTypeId,
                        'date' => $booking['date'],
                        'time_slot' => $booking['timeSlot'],
                        'status' => $booking['status'],
                        'notes' => $booking['notes'] ?? null,
                        'created_at' => $booking['createdAt'] ?? now(),
                    ]
                );
            }
            return response()->json(['status' => 'success']);
        } catch (\Throwable $e) {
            Log::error('syncBookings error: ' . $e->getMessage());
            return response()->json(['status' => 'success', 'warning' => $e->getMessage()]);
        }
    }

    public function syncUsers(Request $request)
    {
        try {
            foreach ($request->input('users', []) as $user) {
                $u = User::where('email', $user['email'])->first();
                if ($u) {
                    $u->update([
                        'npm' => $user['npm'] ?? $u->npm,
                        'nidn' => $user['nidn'] ?? $u->nidn,
                        'department' => $user['department'] ?? $u->department,
                        'is_verified' => isset($user['isVerified']) ? (bool)$user['isVerified'] : $u->is_verified,
                    ]);

                    if (isset($user['role']) && !$u->hasRole($user['role'])) {
                        Role::firstOrCreate(['name' => $user['role'], 'guard_name' => 'web']);
                        $u->syncRoles([$user['role']]);
                    }
                }
            }
            return response()->json(['status' => 'success']);
        } catch (\Throwable $e) {
            Log::error('syncUsers error: ' . $e->getMessage());
            return response()->json(['status' => 'success', 'warning' => $e->getMessage()]);
        }
    }
}
