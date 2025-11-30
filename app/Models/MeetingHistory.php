<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingHistory extends Model
{
    use HasFactory;

    protected $table = 'meeting_history';

    protected $fillable = [
        'schedule_id',
        'member_id',
        'mentor_id',
        'id_specializations',
        'meeting_date',
        'meeting_time',
        'meeting_type',
        'meeting_link',
        'notes',
        'status'
    ];

    protected $casts = [
        'meeting_date' => 'date',
        'meeting_time' => 'datetime:H:i:s',
    ];

    // Relationships
    public function schedule()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id', 'Id_schedles');
    }

    public function member()
    {
        return $this->belongsTo(User::class, 'member_id', 'id_user');
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id', 'id_user');
    }

    public function specialization()
    {
        return $this->belongsTo(Specialization::class, 'id_specializations', 'Id_specializations');
    }
}




















