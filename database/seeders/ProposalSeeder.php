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
        // Clear all demo proposals, proposal titles, and thesis records
        ProposalTitle::query()->delete();
        Thesis::query()->delete();
        TitleSubmission::query()->delete();
    }
}
