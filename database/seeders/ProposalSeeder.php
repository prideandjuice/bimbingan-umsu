<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TitleSubmission;
use App\Models\ProposalTitle;
use App\Models\Thesis;
use Illuminate\Database\Seeder;

class ProposalSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::where('email', 'mahasiswa@umsu.ac.id')->first();
        if (!$student) return;

        // 1. Induk Pengajuan Judul (TitleSubmission)
        $submission = TitleSubmission::firstOrCreate(
            ['student_id' => $student->id],
            [
                'title' => 'Digital Branding Usaha Mikro, Kecil, dan Menengah (UMKM) Kuliner',
                'abstract' => '<p>Usaha Mikro, Kecil, dan Menengah (UMKM) sektor kuliner...</p>',
                'status' => 'approved',
                'department' => 'Magister Ilmu Komunikasi',
            ]
        );

        // 2. Judul yang Diajukan (Hanya Judul yang Disetujui / ACCEPTED)
        ProposalTitle::whereIn('id', ['title-demo-1', 'title-demo-3'])->delete();

        $titles = [
            [
                'id' => 'title-demo-2',
                'proposal_id' => $submission->id,
                'title' => 'Digital Branding Usaha Mikro, Kecil, dan Menengah (UMKM) Kuliner Melalui Narrative Marketing di Instagram',
                'abstract' => '<p>Usaha Mikro, Kecil, dan Menengah (UMKM) sektor kuliner mengalami pertumbuhan pesat...</p>',
                'status' => 'ACCEPTED',
                'notes' => 'Judul disetujui oleh Kaprodi.',
                'sk_file' => 'storage/sk/sk_thesis-1784779939659_1784780065.pdf',
            ],
        ];

        foreach ($titles as $t) {
            ProposalTitle::updateOrCreate(['id' => $t['id']], $t);
        }

        // 3. Rekord Tabel Thesis untuk skripsi aktif (dengan metadata SK File & Dosen Pembimbing)
        $lecturer = User::where('email', 'irwan@umsu.ac.id')->first();

        Thesis::updateOrCreate(
            ['student_id' => $student->id],
            [
                'id' => 'thesis-demo-1',
                'proposal_id' => $submission->id,
                'title_submission_id' => $submission->id,
                'title' => 'Digital Branding Usaha Mikro, Kecil, dan Menengah (UMKM) Kuliner Melalui Narrative Marketing di Instagram',
                'status' => 'active',
                'metadata' => [
                    'sk_file' => 'storage/sk/sk_thesis-1784779939659_1784780065.pdf',
                    'supervisors' => [
                        'current' => [
                            'supervisor_1' => $lecturer ? (string) $lecturer->id : null,
                        ]
                    ]
                ]
            ]
        );
    }
}

