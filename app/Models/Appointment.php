<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'thesis_id',
        'student_id',
        'lecturer_id',
        'event_type_id',
        'appointment_date',
        'meeting_type',
        'meeting_url',
        'meeting_location',
        'date',
        'time_slot',
        'status',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'appointment_date' => 'datetime',
        'metadata' => 'array',
    ];

    public function thesis()
    {
        return $this->belongsTo(Thesis::class, 'thesis_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function eventType()
    {
        return $this->belongsTo(EventType::class, 'event_type_id');
    }
}
