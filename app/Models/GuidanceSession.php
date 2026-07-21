<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuidanceSession extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'thesis_id',
        'appointment_id',
        'meeting_no',
        'result',
        'date',
        'notes',
        'revisions',
        'progress',
        'created_by',
        'creator_name',
        'status',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function thesis()
    {
        return $this->belongsTo(Thesis::class, 'thesis_id');
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class, 'appointment_id');
    }
}
