<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'is_read',
        'read_at'
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
        'read_at' => 'datetime'
    ];

    // Scope untuk notifikasi yang belum dibaca
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    // Scope untuk notifikasi yang sudah dibaca
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    // Method untuk menandai notifikasi sebagai sudah dibaca
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }

    // Method untuk menandai semua notifikasi sebagai sudah dibaca
    public static function markAllAsRead()
    {
        self::where('is_read', false)->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }
}
