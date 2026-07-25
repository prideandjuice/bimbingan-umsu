<?php

namespace App\Observers;

use App\Models\Availability;

class AvailabilityObserver
{
    /**
     * Handle the Availability "saving" event.
     * Mengatur agar hanya ada 1 jadwal default per dosen (lecturer_id).
     * Jika jadwal ini diset is_default = true, maka jadwal ketersediaan lain
     * milik dosen yang sama akan otomatis diset is_default = false.
     */
    public function saving(Availability $availability): void
    {
        if ($availability->is_default) {
            Availability::where('lecturer_id', $availability->lecturer_id)
                ->where('id', '!=', $availability->id)
                ->update(['is_default' => false]);
        }
    }
}
