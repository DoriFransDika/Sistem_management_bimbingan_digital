# Setup Laravel Scheduler untuk Auto-Move Schedules

## Penjelasan
Sistem ini secara otomatis memindahkan jadwal yang sudah selesai (waktu sudah lewat) dari status `approved`/`confirmed` ke status `completed` sehingga muncul di halaman riwayat member.

## Setup Scheduler

### 1. Tambahkan ke Crontab (Linux/Mac)
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

### 2. Untuk Windows (Laragon/XAMPP)
Buat file batch `run-scheduler.bat`:
```batch
@echo off
cd /d "C:\laragon\www\kp\Sistem_Manajemen_Bimbingan_Digital"
php artisan schedule:run
```

Kemudian jalankan dengan Task Scheduler Windows setiap menit.

### 3. Manual Testing
Untuk testing manual, jalankan:
```bash
php artisan schedules:move-to-history
```

## Command yang Dijalankan
- **Command**: `schedules:move-to-history`
- **Frequency**: Setiap jam (hourly)
- **Fungsi**: Memindahkan jadwal dengan status `approved`/`confirmed` yang waktunya sudah lewat ke status `completed`

## Status Jadwal
- `pending_approval` → Menunggu persetujuan mentor
- `approved` → Disetujui mentor
- `confirmed` → Dikonfirmasi member
- `completed` → Selesai (otomatis pindah ke riwayat)
- `rejected` → Ditolak mentor (langsung ke riwayat)
- `cancelled` → Dibatalkan (langsung ke riwayat)

## Halaman Riwayat Member
- URL: `/member/riwayat`
- Menampilkan jadwal dengan status: `completed`, `rejected`, `cancelled`
- Fitur rating untuk jadwal yang `completed`
- Filter berdasarkan status
- Search berdasarkan mentor atau jenis pelatihan


















