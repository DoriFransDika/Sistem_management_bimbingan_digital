<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status'
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    protected $primaryKey = 'id_user';
    public $incrementing = false;
    protected $keyType = 'string';
    protected static function boot()
    {
        parent::boot();

        static::creating(function (User $model) {
            if (! $model->getKey()) {
                // Ambil angka terbesar saat ini dari id_user yang berformat 'U<number>'
                $latestNumericId = static::query()
                    ->whereRaw("id_user REGEXP '^[Uu][0-9]+$'")
                    ->selectRaw("CAST(SUBSTRING(id_user, 2) AS UNSIGNED) as num")
                    ->orderByDesc('num')
                    ->value('num');

                $next = ($latestNumericId ?? 0) + 1;
                $model->{$model->getKeyName()} = 'U' . $next;
            }
        });
    }

    //==================================
    // RELASI-RELASI
    //==================================

    /**
     * Relasi HasOne: Satu User punya satu MemberProfile.
     */
    public function memberProfile(): HasOne
    {
        return $this->hasOne(MemberProfile::class, 'user_id', 'id_user');
    }

    /**
     * Relasi HasOne: Satu User punya satu MentorProfile.
     */
    public function mentorProfile(): HasOne
    {
        return $this->hasOne(MentorProfile::class, 'user_id', 'id_user');
    }
    
    /**
     * Relasi HasMany: Satu User (member) bisa ada di banyak Meeting.
     */
    public function meetingsAsMember(): HasMany
    {
        return $this->hasMany(Meeting::class, 'member_id', 'id_user');
    }

    /**
     * Relasi HasMany: Satu User (mentor) bisa ada di banyak Meeting.
     */
    public function meetingsAsMentor(): HasMany
    {
        return $this->hasMany(Meeting::class, 'mentor_id', 'id_user');
    }

    /**
     * Relasi HasMany: General meetings relationship for counting.
     */
    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class, 'mentor_id', 'id_user');
    }

    /**
     * Relasi HasMany: Satu User bisa punya banyak ActivityLog.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'user_id', 'id_user');
    }

    //==================================
    // METHOD BANTU (HELPERS)
    //==================================

    public function logActivity($action, $description, $model = null)
    {
        // ... (kode ini sudah benar, tidak perlu diubah)
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isMember()
    {
        return $this->role === 'member';
    }

    public function isMentor()
    {
        return $this->role === 'mentor';
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class, 'mentor_id', 'id_user');
    }

    /**
     * Relasi HasMany: Satu User (member) bisa punya banyak Rating.
     */
    public function memberRatings(): HasMany
    {
        return $this->hasMany(Rating::class, 'member_id', 'id_user');
    }


    //===================================================================
    // METHOD-METHOD LAMA YANG SEKARANG SUDAH TIDAK DIPERLUKAN LAGI
    // KITA HAPUS KARENA DATANYA SEKARANG DIAMBIL DARI PROFIL
    // Contoh: $user->memberProfile->remaining_sessions
    //===================================================================
    // public function getCompletedMeetingsCount() { ... }
    // public function getTotalMeetingsCount() { ... }
    // public function getRemainingSessions() { ... }
    // public function getLatestMeetingType() { ... }
}