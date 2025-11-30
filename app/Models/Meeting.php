<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Meeting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'member_id',
        'mentor_id',
        'schedule',
        'status',
        'topic',
        'notes',
        'feedback',
        'rating',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'schedule' => 'datetime',
    ];

    /**
     * Get the member that owns the meeting.
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(User::class, 'member_id', 'id_user');
    }

    /**
     * Get the mentor that owns the meeting.
     */
    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id', 'id_user');
    }
}