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
            $lecturerId = auth()->id();
            if ($lecturerId) {
                $incomingIds = collect($request->input('eventTypes', []))->pluck('id')->toArray();
                EventType::where('lecturer_id', $lecturerId)->whereNotIn('id', $incomingIds)->delete();

                foreach ($request->input('eventTypes', []) as $et) {
                    EventType::updateOrCreate(
                        ['id' => $et['id']],
                        [
                            'lecturer_id' => $et['lecturerId'],
                            'name' => $et['name'],
                            'duration' => $et['duration'],
                            'description' => $et['description'] ?? null,
                        ]
                    );
                }
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
            $lecturerId = auth()->id();
            if ($lecturerId) {
                $incomingIds = collect($request->input('availabilityRules', []))->pluck('id')->toArray();
                Availability::where('lecturer_id', $lecturerId)->whereNotIn('id', $incomingIds)->delete();

                foreach ($request->input('availabilityRules', []) as $rule) {
                    Availability::updateOrCreate(
                        ['id' => $rule['id']],
                        [
                            'lecturer_id' => $rule['lecturerId'],
                            'day_of_week' => $rule['dayOfWeek'],
                            'start_time' => $rule['startTime'],
                            'end_time' => $rule['endTime'],
                        ]
                    );
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
            foreach ($request->input('bookings', []) as $booking) {
                $thesisId = $booking['thesisId'] ?? null;
                if ($thesisId && !Thesis::where('id', $thesisId)->exists()) {
                    $thesisId = null;
                }

                $studentId = $booking['studentId'] ?? null;
                if (!$studentId || !User::where('id', $studentId)->exists()) {
                    $studentId = auth()->id() ?? User::first()?->id;
                }
                if (!$studentId) continue;

                $lecturerId = $booking['lecturerId'] ?? null;
                if (!$lecturerId || !User::where('id', $lecturerId)->exists()) {
                    continue;
                }

                Appointment::updateOrCreate(
                    ['id' => $booking['id']],
                    [
                        'thesis_id' => $thesisId,
                        'student_id' => $studentId,
                        'lecturer_id' => $lecturerId,
                        'event_type_id' => $booking['eventTypeId'] ?? null,
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
