<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Thesis extends Model
{
    use HasFactory, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'proposal_id',
        'title_submission_id',
        'title',
        'student_id',
        'status',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function proposal()
    {
        return $this->belongsTo(TitleSubmission::class, 'proposal_id');
    }

    public function titleSubmission()
    {
        return $this->belongsTo(TitleSubmission::class, 'title_submission_id');
    }
}
