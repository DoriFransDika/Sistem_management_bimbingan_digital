<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Specialization extends Model
{
    use HasFactory;
    protected $fillable = ['name'];

    /**
     * String primary key configuration.
     */
    protected $primaryKey = 'Id_specializations';
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Specialization $model) {
            if (! $model->getKey()) {
                $latestNumericId = static::query()
                    ->whereRaw("Id_specializations REGEXP '^[Ss][0-9]+$'")
                    ->selectRaw("CAST(SUBSTRING(Id_specializations, 2) AS UNSIGNED) as num")
                    ->orderByDesc('num')
                    ->value('num');

                $next = ($latestNumericId ?? 0) + 1;
                $model->{$model->getKeyName()} = 'S' . $next;
            }
        });
    }
}
