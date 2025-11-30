<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rating extends Model
{
    protected $primaryKey = 'id_rating';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_rating',
        'mentor_id',
        'member_id',
        'rating',
        'review'
    ];

    protected $casts = [
        'rating' => 'decimal:1'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Rating $model) {
            if (! $model->getKey()) {
                $latestNumericId = static::query()
                    ->whereRaw("id_rating REGEXP '^[Rr][Tt][0-9]+$'")
                    ->selectRaw("CAST(SUBSTRING(id_rating, 3) AS UNSIGNED) as num")
                    ->orderByDesc('num')
                    ->value('num');

                $next = ($latestNumericId ?? 0) + 1;
                $model->{$model->getKeyName()} = 'RT' . $next;
            }
        });
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id', 'id_user');
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(User::class, 'member_id', 'id_user');
    }
}
