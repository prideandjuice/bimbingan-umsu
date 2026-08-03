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
        'availability_id',
        'lecturer_id',
        'name',
        'slug',
        'is_default',
        'rules',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'rules' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = 'ar-' . (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function eventTypes()
    {
        return $this->hasMany(EventType::class, 'availability_id');
    }
}
