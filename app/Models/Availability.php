<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
