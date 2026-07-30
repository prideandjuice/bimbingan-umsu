<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventType extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'availability_id',
        'lecturer_id',
        'name',
        'slug',
        'duration',
        'description',
        'location_type',
        'location_details',
    ];

    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function availability()
    {
        return $this->belongsTo(Availability::class, 'availability_id');
    }
}
