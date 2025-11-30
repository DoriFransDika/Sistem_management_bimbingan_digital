<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberProfile extends Model
{
    use HasFactory;
    protected $fillable = [
        'Id_member',
        'user_id', 
        'phone', 
        'delivery_mode',
        'Id_specializations',
        'remaining_sessions',
    ];

    protected $primaryKey = 'Id_member';
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        static::creating(function (MemberProfile $model) {
            if (! $model->getKey()) {
                $latestNumericId = static::query()
                    ->whereRaw("Id_member REGEXP '^[Mm][Bb][0-9]+$'")
                    ->selectRaw("CAST(SUBSTRING(Id_member, 3) AS UNSIGNED) as num")
                    ->orderByDesc('num')
                    ->value('num');

                $next = ($latestNumericId ?? 0) + 1;
                $model->{$model->getKeyName()} = 'MB' . $next;
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
}