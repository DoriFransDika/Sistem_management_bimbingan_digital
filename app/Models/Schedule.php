<?php

// app/Models/Schedule.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'Id_schedles',
        'member_id',
        'mentor_id',
        'Id_specializations',
        'materi_id', // Foreign key ke tabel materi
        'proposed_date',
        'proposed_time',
        'status',
        'rejection_reason',
        'materi_modul',
        'materi_topik',
        'materi_sub_topik',
        'dokumentasi',
        'laporan_dikirim_at',
    ];

    protected $primaryKey = 'Id_schedles';
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Schedule $model) {
            if (! $model->getKey()) {
                $latestNumericId = static::query()
                    ->whereRaw("Id_schedles REGEXP '^[Ss][Cc][0-9]+$'")
                    ->selectRaw("CAST(SUBSTRING(Id_schedles, 3) AS UNSIGNED) as num")
                    ->orderByDesc('num')
                    ->value('num');

                $next = ($latestNumericId ?? 0) + 1;
                $model->{$model->getKeyName()} = 'SC' . $next;
            }
        });
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(User::class, 'member_id', 'id_user');
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id', 'id_user');
    }

    public function materi(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'materi_id', 'id_materi');
    }

    public function specialization(): BelongsTo
    {
        return $this->belongsTo(Specialization::class, 'Id_specializations', 'Id_specializations');
    }

    /**
     * Validasi untuk status completed - materi harus ada
     */
    public function validateCompletedStatus()
    {
        if ($this->status === 'completed') {
            if (empty($this->materi_id) || empty($this->materi_modul) || empty($this->materi_topik) || empty($this->materi_sub_topik)) {
                throw new \Exception('Schedule dengan status completed harus memiliki data materi yang lengkap');
            }
        }
    }

    /**
     * Override update method untuk validasi
     */
    public function update(array $attributes = [], array $options = [])
    {
        $result = parent::update($attributes, $options);
        
        // Reload model untuk mendapatkan data terbaru
        $this->refresh();
        
        // Validasi jika status adalah completed
        $this->validateCompletedStatus();
        
        return $result;
    }
}