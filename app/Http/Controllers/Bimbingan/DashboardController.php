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
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $users = User::all()->map(function ($u) {
            return [
                'id' => (string) $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->roles->first()?->name ?? 'guest',
                'npm' => $u->npm,
                'nidn' => $u->nidn,
                'department' => $u->department,
                'isVerified' => (bool) $u->is_verified,
                'avatar' => $u->profile_photo ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            ];
        });

        $proposals = TitleSubmission::all()->map(function ($p) {
            return [
                'id' => (string) $p->id,
                'studentId' => (string) $p->student_id,
                'studentName' => $p->student->name ?? 'Unknown',
                'studentNpm' => $p->student->npm ?? '',
                'department' => $p->student->department ?? '',
                'abstract' => $p->abstract,
                'status' => $p->status,
                'createdAt' => $p->created_at->toISOString(),
            ];
        });

        $proposalTitles = ProposalTitle::all()->map(function ($pt) {
            return [
                'id' => $pt->id,
                'proposalId' => (string) $pt->proposal_id,
                'title' => $pt->title,
                'status' => $pt->status,
                'notes' => $pt->notes,
            ];
        });

        $theses = Thesis::all()->map(function ($t) {
            $supervisorId = $t->metadata['supervisors']['current']['supervisor_1'] ?? null;
            $supervisorName = null;
            if ($supervisorId) {
                $supervisor = User::find($supervisorId);
                $supervisorName = $supervisor ? $supervisor->name : null;
            }

            return [
                'id' => $t->id,
                'proposalId' => (string) $t->proposal_id,
                'title' => $t->title,
                'studentId' => (string) $t->student_id,
                'studentName' => $t->student->name ?? 'Unknown',
                'studentNpm' => $t->student->npm ?? '',
                'department' => $t->student->department ?? '',
                'supervisorId' => $supervisorId ? (string)$supervisorId : null,
                'supervisorName' => $supervisorName,
                'status' => $t->status,
                'createdAt' => $t->created_at->toISOString(),
            ];
        });

        $guidances = GuidanceSession::all()->map(function ($g) {
            return [
                'id' => $g->id,
                'thesisId' => $g->thesis_id,
                'date' => $g->date,
                'notes' => $g->notes,
                'revisions' => $g->revisions,
                'progress' => (int)$g->progress,
                'createdBy' => $g->created_by,
                'creatorName' => $g->creator_name,
                'status' => $g->status,
                'createdAt' => $g->created_at->toISOString(),
            ];
        });

        $eventTypes = EventType::all()->map(function ($et) {
            return [
                'id' => $et->id,
                'lecturerId' => (string)$et->lecturer_id,
                'name' => $et->name,
                'duration' => (int)$et->duration,
                'description' => $et->description,
            ];
        });

        $availabilityRules = Availability::all()->map(function ($a) {
            return [
                'id' => $a->id,
                'lecturerId' => (string)$a->lecturer_id,
                'dayOfWeek' => (int)$a->day_of_week,
                'startTime' => $a->start_time,
                'endTime' => $a->end_time,
            ];
        });

        $bookings = Appointment::all()->map(function ($ap) {
            $lecturer = User::find($ap->lecturer_id);
            $eventType = EventType::find($ap->event_type_id);

            return [
                'id' => $ap->id,
                'thesisId' => $ap->thesis_id,
                'studentId' => (string)$ap->student_id,
                'studentName' => $ap->student->name ?? 'Unknown',
                'studentNpm' => $ap->student->npm ?? '',
                'lecturerId' => (string)$ap->lecturer_id,
                'lecturerName' => $lecturer ? $lecturer->name : 'Unknown',
                'eventTypeId' => $ap->event_type_id,
                'eventTypeName' => $eventType ? $eventType->name : 'Default Bimbingan',
                'date' => $ap->date,
                'timeSlot' => $ap->time_slot,
                'status' => $ap->status,
                'notes' => $ap->notes,
                'createdAt' => $ap->created_at->toISOString(),
            ];
        });

        return Inertia::render('dashboard', [
            'dbUsers' => $users,
            'dbProposals' => $proposals,
            'dbProposalTitles' => $proposalTitles,
            'dbTheses' => $theses,
            'dbGuidances' => $guidances,
            'dbEventTypes' => $eventTypes,
            'dbAvailabilityRules' => $availabilityRules,
            'dbBookings' => $bookings,
        ]);
    }
}
