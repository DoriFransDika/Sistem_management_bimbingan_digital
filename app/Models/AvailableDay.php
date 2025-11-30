<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AvailableDay extends Model
{
    use HasFactory;

    protected $table = 'available_days';
    protected $fillable = ['name', 'sort_order'];

    // Tidak perlu timestamps untuk data statis seperti hari
    public $timestamps = false;

    protected $primaryKey = 'Id_day';
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        static::creating(function (AvailableDay $model) {
            if (! $model->getKey()) {
                $latestNumericId = static::query()
                    ->whereRaw("Id_day REGEXP '^[Dd][0-9]+$'")
                    ->selectRaw("CAST(SUBSTRING(Id_day, 2) AS UNSIGNED) as num")
                    ->orderByDesc('num')
                    ->value('num');

                $next = ($latestNumericId ?? 0) + 1;
                $model->{$model->getKeyName()} = 'D' . $next;
            }
        });
    }

    // Data statis untuk hari-hari
    public static function getDays()
    {
        return [
            'Senin',
            'Selasa', 
            'Rabu',
            'Kamis',
            'Jumat',
            'Sabtu',
            'Minggu'
        ];
    }
}