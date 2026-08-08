<?php

namespace App\Http\Controllers\Bimbingan;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Availability;
use App\Models\EventType;
use App\Models\GuidanceSession;
use App\Models\ProposalTitle;
use App\Models\Thesis;
use App\Models\TitleSubmission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request, $tab = 'overview')
    {
        $activeTab = $this->resolveActiveTab($request, (string) $tab);

        $users = User::with('roles')->get()->map(function ($u) {
            // User::all(): Mengambil semua record dari tabel users di database.
            // ->map(function ($u): Memproses/mengubah setiap objek user satu per satu (dimana $u adalah satu individu user) di dalam memory sebelum dikembalikan ke variabel $users.
            $role = $u->roles->first()?->name;
            // $u->roles: Mengakses relasi Eloquent roles milik user tersebut (biasanya menggunakan paket seperti Spatie Permission)
            // ->first(): Mengambil role pertama yang dimiliki oleh user.
            if (! $role || $role === 'guest') {
                $role = 'student';
                // Jika user tidak memiliki role (nilainya null atau kosong).
                // atau jika role-nya adalah 'guest', maka akan diubah menjadi 'student'.
                // Ini digunakan sebagai fallback untuk memastikan setiap user memiliki role yang valid untuk aplikasi.
                // Secara implisit, ini menetapkan 'student' sebagai role default bagi pengguna baru jika tidak ada role lain yang ditugaskan.
            }

            return [
                'id' => (string) $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $role,
                'npm' => $u->npm ?? '2210000001',
                'nidn' => $u->nidn,
                'department' => $u->department ?? 'Magister Ilmu Komunikasi',
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
                'supervisorId' => $supervisorId ? (string) $supervisorId : null,
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
                'progress' => (int) $g->progress,
                'createdBy' => $g->created_by,
                'creatorName' => $g->creator_name,
                'status' => $g->status,
                'createdAt' => $g->created_at->toISOString(),
                'draftFileName' => $g->metadata['draft_file_name'] ?? null,
                'draftFilePath' => $g->metadata['draft_file_path'] ?? null,
                'annotations' => $g->metadata['annotations'] ?? null,
                'bookingId' => $g->metadata['booking_id'] ?? null,
            ];
        });

        $eventTypes = EventType::all()->map(function ($et) {
            return [
                'id' => $et->id,
                'availabilityId' => $et->availability_id ? (string) $et->availability_id : null,
                'lecturerId' => (string) $et->lecturer_id,
                'name' => $et->name,
                'slug' => $et->slug,
                'duration' => (int) $et->duration,
                'maxQuotaPerSession' => $et->max_quota_per_session ? (int) $et->max_quota_per_session : null,
                'description' => $et->description,
                'locationType' => $et->location_type ?? 'offline',
                'locationDetails' => $et->location_details ?: (($et->location_type === 'online') ? 'Google Meet UMSU' : 'Ruang Dosen Gedung A / Ruang Prodi UMSU'),
            ];
        });

        $availabilityRules = Availability::all()->map(function ($a) {
            return [
                'id' => $a->id,
                'availabilityId' => $a->availability_id,
                'lecturerId' => (string) $a->lecturer_id,
                'name' => $a->name,
                'slug' => $a->slug,
                'dayOfWeek' => (int) $a->day_of_week,
                'startTime' => $a->start_time,
                'endTime' => $a->end_time,
                'isDefault' => (bool) $a->is_default,
                'rules' => $a->rules,
            ];
        });

        $bookings = Appointment::all()->map(function ($ap) {
            $lecturer = User::find($ap->lecturer_id);
            $eventType = EventType::find($ap->event_type_id);

            return [
                'id' => $ap->id,
                'thesisId' => $ap->thesis_id,
                'studentId' => (string) $ap->student_id,
                'studentName' => $ap->student->name ?? 'Unknown',
                'studentNpm' => $ap->student->npm ?? '',
                'lecturerId' => (string) $ap->lecturer_id,
                'lecturerName' => $lecturer ? $lecturer->name : 'Unknown',
                'eventTypeId' => $ap->event_type_id,
                'eventTypeName' => $eventType ? $eventType->name : 'Default Bimbingan',
                'date' => $ap->date,
                'timeSlot' => $ap->time_slot,
                'status' => $ap->status,
                'notes' => $ap->notes,
                'draftFileName' => $ap->metadata['draftFileName'] ?? null,
                'draftFilePath' => $ap->metadata['draftFilePath'] ?? null,
                'annotations' => $ap->metadata['annotations'] ?? null,
                'createdAt' => $ap->created_at->toISOString(),
            ];
        });

        return Inertia::render('dashboard', [
            'activeTab' => $activeTab,
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

    public function uploadDraft(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = 'draft_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            // Store file in public disk (storage/app/public/drafts)
            $path = $file->storeAs('drafts', $filename, 'public');
            $filePath = '/storage/' . $path;

            return response()->json([
                'status' => 'success',
                'fileName' => $file->getClientOriginalName(),
                'filePath' => $filePath,
            ]);
        }

        return response()->json(['status' => 'error', 'message' => 'File not uploaded'], 400);
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
            if (! is_array($metadata)) {
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

    public function bookingDetailPage(Request $request, $id)
    {
        return Inertia::render('bimbingan/BookingDetailPage', [
            'bookingId' => $id,
        ]);
    }

    public function bookingSlugPage(Request $request, $param1, $param2 = null)
    {
        $lecturerUsername = $param2 !== null ? $param1 : null;
        $slug = $param2 !== null ? $param2 : $param1;

        $lecturer = null;
        if ($lecturerUsername && $lecturerUsername !== 'bimbingan') {
            $cleanLecturerStr = str_replace('-', '%', $lecturerUsername);
            $lecturer = User::where('name', 'like', '%' . $cleanLecturerStr . '%')
                ->orWhere('email', 'like', $lecturerUsername . '%')
                ->first();
        }

        $eventTypeQuery = EventType::with('lecturer')->where('slug', $slug);
        if ($lecturer) {
            $eventTypeQuery->where('lecturer_id', $lecturer->id);
        }
        $eventType = $eventTypeQuery->first() ?? EventType::with('lecturer')->where('slug', $slug)->first();

        if (! $eventType) {
            $eventType = EventType::with('lecturer')->where('id', $slug)->first()
                ?? EventType::with('lecturer')->first();
        }

        if (! $lecturer) {
            $lecturer = $eventType ? $eventType->lecturer : User::whereHas('roles', fn($q) => $q->where('name', 'lecturer'))->first();
        }

        $availabilities = [];
        if ($lecturer) {
            $query = Availability::where('lecturer_id', $lecturer->id);

            if ($eventType && $eventType->availability_id) {
                $targetAvail = Availability::find($eventType->availability_id);
                $targetName = $targetAvail ? $targetAvail->name : $eventType->availability_id;

                $linked = (clone $query)->where(function ($q) use ($eventType, $targetName) {
                    $q->where('id', $eventType->availability_id)
                        ->orWhere('availability_id', $eventType->availability_id)
                        ->orWhere('name', $eventType->availability_id);
                    if ($targetName) {
                        $q->orWhere('name', $targetName);
                    }
                })->get();

                if ($linked->count() > 0) {
                    $availabilities = $linked->map(function ($a) {
                        $firstSlot = $a->rules['slots'][0] ?? ['dayOfWeek' => 1, 'startTime' => '08:00', 'endTime' => '16:00'];

                        return [
                            'id' => (string) $a->id,
                            'availabilityId' => (string) $a->id,
                            'lecturerId' => (string) $a->lecturer_id,
                            'name' => $a->name,
                            'dayOfWeek' => (int) ($firstSlot['dayOfWeek'] ?? 1),
                            'startTime' => (string) ($firstSlot['startTime'] ?? '08:00'),
                            'endTime' => (string) ($firstSlot['endTime'] ?? '16:00'),
                            'isDefault' => (bool) $a->is_default,
                            'rules' => $a->rules,
                        ];
                    });
                }
            }

            if (empty($availabilities) || count($availabilities) === 0) {
                $availabilities = $query->get()->map(function ($a) {
                    $firstSlot = $a->rules['slots'][0] ?? ['dayOfWeek' => 1, 'startTime' => '08:00', 'endTime' => '16:00'];

                    return [
                        'id' => (string) $a->id,
                        'availabilityId' => (string) $a->id,
                        'lecturerId' => (string) $a->lecturer_id,
                        'name' => $a->name,
                        'dayOfWeek' => (int) ($firstSlot['dayOfWeek'] ?? 1),
                        'startTime' => (string) ($firstSlot['startTime'] ?? '08:00'),
                        'endTime' => (string) ($firstSlot['endTime'] ?? '16:00'),
                        'isDefault' => (bool) $a->is_default,
                        'rules' => $a->rules,
                    ];
                });
            }
        }

        return Inertia::render('bimbingan/BookingSlugPage', [
            'slug' => $slug,
            'eventType' => $eventType ? [
                'id' => (string) $eventType->id,
                'lecturerId' => (string) $eventType->lecturer_id,
                'availabilityId' => (string) $eventType->availability_id,
                'name' => $eventType->name,
                'slug' => $eventType->slug,
                'duration' => (int) $eventType->duration,
                'maxQuotaPerSession' => $eventType->max_quota_per_session ? (int) $eventType->max_quota_per_session : null,
                'description' => $eventType->description,
                'locationType' => $eventType->location_type ?? 'offline',
                'locationDetails' => $eventType->location_details ?: (($eventType->location_type === 'online') ? 'Google Meet UMSU' : 'Ruang Dosen Gedung A / Ruang Prodi UMSU'),
            ] : null,
            'lecturer' => $lecturer ? [
                'id' => (string) $lecturer->id,
                'name' => $lecturer->name,
                'email' => $lecturer->email,
                'nidn' => $lecturer->nidn ?? '0012345678',
                'department' => $lecturer->department ?? 'Magister Ilmu Komunikasi',
                'avatar' => $lecturer->profile_photo ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            ] : null,
            'availabilityRules' => $availabilities,
        ]);
    }

    private function resolveActiveTab(Request $request, string $tab): string
    {
        $rawTab = $tab ?: $request->route('tab') ?: 'overview';
        $uri = $request->getRequestUri();

        if (in_array($rawTab, ['booking-jadwal', 'bookings']) || str_contains($uri, '/mahasiswa/booking-jadwal')) {
            return 'booking-jadwal';
        }

        if (in_array($rawTab, ['log-bimbingan', 'logBimbingan']) || str_contains($uri, '/mahasiswa/log-bimbingan')) {
            return 'log-bimbingan';
        }

        if (in_array($rawTab, ['bookings', 'persetujuan-jadwal', 'permohonan-jadwal']) || str_contains($uri, '/dosen/persetujuan-jadwal') || str_contains($uri, '/dosen/permohonan-jadwal')) {
            return 'bookings';
        }

        if (in_array($rawTab, ['eventTypes', 'event-types', 'jenis-bimbingan', 'tipe-bimbingan']) || str_contains($uri, '/dosen/jenis-bimbingan') || str_contains($uri, '/dosen/event-types')) {
            return 'eventTypes';
        }

        if (in_array($rawTab, ['scheduling', 'ketersediaan-waktu', 'atur-jadwal']) || str_contains($uri, '/dosen/ketersediaan-waktu') || str_contains($uri, '/dosen/atur-jadwal')) {
            return 'scheduling';
        }

        if (in_array($rawTab, ['logBimbingan', 'log-bimbingan', 'verifikasi-log']) || str_contains($uri, '/dosen/log-bimbingan')) {
            return 'logBimbingan';
        }

        if (in_array($rawTab, ['students', 'mahasiswa-bimbingan', 'progres-mahasiswa']) || str_contains($uri, '/dosen/mahasiswa-bimbingan') || str_contains($uri, '/dosen/progres-mahasiswa')) {
            return 'students';
        }

        return $rawTab;
    }
}
