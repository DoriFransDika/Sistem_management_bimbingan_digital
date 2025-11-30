<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\DB;

class MentorProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'Id_mentor',
        'user_id',
        'phone',
        'specialization_ids',
        'available_day_ids'
    ];

    protected $casts = [
        'specialization_ids' => 'array',
        'available_day_ids' => 'array',
    ];

    protected $primaryKey = 'Id_mentor';
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        static::creating(function (MentorProfile $model) {
            if (! $model->getKey()) {
                $latestNumericId = static::query()
                    ->whereRaw("Id_mentor REGEXP '^[Mm][Tt][0-9]+$'")
                    ->selectRaw("CAST(SUBSTRING(Id_mentor, 3) AS UNSIGNED) as num")
                    ->orderByDesc('num')
                    ->value('num');

                $next = ($latestNumericId ?? 0) + 1;
                $model->{$model->getKeyName()} = 'MT' . $next;
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id_user');
    }

    public function specialization(): BelongsTo
    {
        return $this->belongsTo(Specialization::class, 'Id_specializations', 'Id_specializations');
    }

    public function day(): BelongsTo
    {
        return $this->belongsTo(AvailableDay::class, 'Id_day', 'Id_day');
    }

    // Helper methods untuk mendapatkan specializations dan days dari JSON
    public function getSpecializations()
    {
        if (!$this->specialization_ids) return collect();
        
        return Specialization::whereIn('Id_specializations', $this->specialization_ids)->get();
    }

    public function getAvailableDays()
    {
        if (!$this->available_day_ids) return collect();
        
        return AvailableDay::whereIn('Id_day', $this->available_day_ids)->get();
    }

    public function getSpecializationNames()
    {
        return $this->getSpecializations()->pluck('name')->toArray();
    }

    public function getAvailableDayNames()
    {
        return $this->getAvailableDays()->pluck('name')->toArray();
    }
}