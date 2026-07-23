<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TitleSubmission;
use App\Models\ProposalTitle;
use Illuminate\Database\Seeder;

class ProposalSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::where('email', 'mahasiswa@umsu.ac.id')->first();
        if (!$student) return;

        $submission = TitleSubmission::firstOrCreate(
            ['student_id' => $student->id],
            [
                'title' => 'Strategi Komunikasi Digital Kampus',
                'abstract' => 'Analisis strategi komunikasi digital dalam meningkatkan brand awareness dan keterlibatan publik.',
                'status' => 'pending',
                'department' => 'Magister Ilmu Komunikasi',
            ]
        );

        $titles = [
            [
                'id' => 'title-demo-1',
                'proposal_id' => $submission->id,
                'title' => 'Strategi Komunikasi Digital Kampus dalam Era Transformasi Teknologi Informasi',
                'abstract' => 'Penelitian ini berfokus pada analisis strategi komunikasi pemasaran digital yang diterapkan oleh institusi pendidikan tinggi dalam membangun brand equity dan meningkatkan interaksi publik di media sosial.',
                'status' => 'PENDING',
            ],
            [
                'id' => 'title-demo-2',
                'proposal_id' => $submission->id,
                'title' => 'Analisis Pola Komunikasi Organisasi pada Manajemen Pelayanan Akademik Publik',
                'abstract' => 'Studi ini meneliti efektivitas aliran informasi internal antara dosen, tenaga kependidikan, dan mahasiswa dalam mengoptimalkan kualitas pelayanan akademik berbasis sistem digital.',
                'status' => 'PENDING',
            ],
            [
                'id' => 'title-demo-3',
                'proposal_id' => $submission->id,
                'title' => 'Pengaruh Media Sosial Instagram terhadap Persepsi Reputasi Lembaga Akademik',
                'abstract' => 'Penelitian kuantitatif yang menguji korelasi antara intensitas publikasi konten edukatif di Instagram dengan persepsi keunggulan reputasi institusi di mata mahasiswa baru.',
                'status' => 'PENDING',
            ],
        ];

        foreach ($titles as $t) {
            ProposalTitle::updateOrCreate(['id' => $t['id']], $t);
        }
    }
}
