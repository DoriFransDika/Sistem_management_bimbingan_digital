<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Materi extends Model
{
    use HasFactory;

    protected $table = 'materi';

    protected $primaryKey = 'id_materi';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_materi',
        'modul',
        'pertemuan',
        'topik',
        'sub_topik'
    ];

    protected $casts = [
        'pertemuan' => 'integer'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Materi $model) {
            if (! $model->getKey()) {
                $latestNumericId = static::query()
                    ->whereRaw("id_materi REGEXP '^[Mm][Tt][Rr][0-9]+$'")
                    ->selectRaw("CAST(SUBSTRING(id_materi, 4) AS UNSIGNED) as num")
                    ->orderByDesc('num')
                    ->value('num');

                $next = ($latestNumericId ?? 0) + 1;
                $model->{$model->getKeyName()} = 'MTR' . $next;
            }
        });
    }

    /**
     * Relasi HasMany: Satu Materi bisa digunakan di banyak Schedule
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'materi_id', 'id_materi');
    }

    /**
     * Get schedules yang completed dengan materi ini
     */
    public function completedSchedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'materi_id', 'id_materi')
            ->where('status', 'completed');
    }
}