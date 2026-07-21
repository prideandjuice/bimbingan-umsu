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

class BimbinganSyncController extends Controller
{
    public function syncProposals(Request $request)
    {
        foreach ($request->input('proposals', []) as $prop) {
            TitleSubmission::updateOrCreate(
                ['id' => $prop['id']],
                [
                    'student_id' => $prop['studentId'],
                    'abstract' => $prop['abstract'],
                    'status' => $prop['status'],
                    'created_at' => $prop['createdAt'] ?? now(),
                ]
            );
        }
        return response()->json(['status' => 'success']);
    }

    public function syncProposalTitles(Request $request)
    {
        foreach ($request->input('proposalTitles', []) as $title) {
            ProposalTitle::updateOrCreate(
                ['id' => $title['id']],
                [
                    'proposal_id' => $title['proposalId'],
                    'title' => $title['title'],
                    'status' => $title['status'],
                    'notes' => $title['notes'] ?? null,
                ]
            );
        }
        return response()->json(['status' => 'success']);
    }

    public function syncTheses(Request $request)
    {
        foreach ($request->input('theses', []) as $thesis) {
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

            Thesis::updateOrCreate(
                ['id' => $thesis['id']],
                [
                    'proposal_id' => $thesis['proposalId'] ?? null,
                    'title' => $thesis['title'],
                    'student_id' => $thesis['studentId'],
                    'status' => $thesis['status'],
                    'metadata' => $metadata,
                    'created_at' => $thesis['createdAt'] ?? now(),
                ]
            );
        }
        return response()->json(['status' => 'success']);
    }

    public function syncGuidances(Request $request)
    {
        foreach ($request->input('guidances', []) as $guidance) {
            GuidanceSession::updateOrCreate(
                ['id' => $guidance['id']],
                [
                    'thesis_id' => $guidance['thesisId'],
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
    }

    public function syncEventTypes(Request $request)
    {
        $lecturerId = auth()->id();
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
        return response()->json(['status' => 'success']);
    }

    public function syncAvailabilityRules(Request $request)
    {
        $lecturerId = auth()->id();
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
        return response()->json(['status' => 'success']);
    }

    public function syncBookings(Request $request)
    {
        foreach ($request->input('bookings', []) as $booking) {
            Appointment::updateOrCreate(
                ['id' => $booking['id']],
                [
                    'thesis_id' => $booking['thesisId'],
                    'student_id' => $booking['studentId'],
                    'lecturer_id' => $booking['lecturerId'],
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
    }

    public function syncUsers(Request $request)
    {
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
                    $u->syncRoles([$user['role']]);
                }
            }
        }
        return response()->json(['status' => 'success']);
    }
}
