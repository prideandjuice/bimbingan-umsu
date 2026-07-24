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
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function index()
    {
        $users = User::all()->map(function ($u) {
            //User::all(): Mengambil semua record dari tabel users di database.
            //->map(function ($u): Memproses/mengubah setiap objek user satu per satu (dimana $u adalah satu individu user) di dalam memory sebelum dikembalikan ke variabel $users.
            $role = $u->roles->first()?->name;
            //$u->roles: Mengakses relasi Eloquent roles milik user tersebut (biasanya menggunakan paket seperti Spatie Permission)
            //->first(): Mengambil role pertama yang dimiliki oleh user.
            if (!$role || $role === 'guest') {
                $role = 'student';
                //Jika user tidak memiliki role (nilainya null atau kosong).
                //atau jika role-nya adalah 'guest', maka akan diubah menjadi 'student'.
                //Ini digunakan sebagai fallback untuk memastikan setiap user memiliki role yang valid untuk aplikasi.
                //Secara implisit, ini menetapkan 'student' sebagai role default bagi pengguna baru jika tidak ada role lain yang ditugaskan. 
            }

            return [
                'id' => (string) $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $role,
                'npm' => $u->npm ?? '2210000001',
                'nidn' => $u->nidn,
                'department' => $u->department ?? 'Magister Ilmu Komunikasi',
                'isVerified' => true,
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
                'abstract' => $pt->abstract,
                'status' => $pt->status,
                'notes' => $pt->notes,
                'skFile' => $pt->sk_file,
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
                'skFile' => $t->metadata['sk_file'] ?? null,
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

    public function uploadSK(Request $request)
    {
        $request->validate([
            'thesis_id' => 'required|string',
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        $thesis = Thesis::findOrFail($request->input('thesis_id'));

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = 'sk_' . $thesis->id . '_' . time() . '.' . $file->getClientOriginalExtension();

            // Store file in public disk (storage/app/public/sk)
            $path = $file->storeAs('sk', $filename, 'public');

            // Update metadata and status
            $metadata = $thesis->metadata;
            if (!is_array($metadata)) {
                $metadata = [];
            }
            $skPath = 'storage/' . $path;
            $metadata['sk_file'] = $skPath;

            $thesis->update([
                'metadata' => $metadata,
                'status' => 'in_progress',
            ]);

            // Update sk_file column in proposal_titles table for consistency
            ProposalTitle::where('proposal_id', $thesis->proposal_id)
                ->where('status', 'ACCEPTED')
                ->update(['sk_file' => $skPath]);

            return response()->json([
                'status' => 'success',
                'skFile' => $skPath,
            ]);
        }

        return response()->json(['status' => 'error', 'message' => 'File not uploaded'], 400);
    }
}
