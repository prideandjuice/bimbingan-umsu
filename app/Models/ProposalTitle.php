<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProposalTitle extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'proposal_id',
        'title',
        'status',
        'notes',
    ];

    public function proposal()
    {
        return $this->belongsTo(TitleSubmission::class, 'proposal_id');
    }
}
