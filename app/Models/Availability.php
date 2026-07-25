<?php

namespace App\Models;

use App\Observers\AvailabilityObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([AvailabilityObserver::class])]
class Availability extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'lecturer_id',
        'name',
        'is_default',
        'rules',
        'day_of_week',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'rules' => 'array',
    ];

    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }
}
