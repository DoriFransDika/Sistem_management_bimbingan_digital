# Panduan Status `pending_admin_verification` di Schedules

## Overview
Status `pending_admin_verification` digunakan untuk menangani penolakan dari mentor yang memerlukan verifikasi dari admin sebelum keputusan final dibuat.

## Struktur Database

### Enum Status di Tabel Schedules
```sql
ENUM(
    'pending_approval',
    'approved', 
    'pending_admin_verification',
    'rejected',
    'confirmed',
    'completed'
)
```

### Kolom yang Relevan
- `status`: Status jadwal (termasuk `pending_admin_verification`)
- `rejection_reason`: Alasan penolakan dari mentor
- `member_id`: ID member yang mengajukan jadwal
- `mentor_id`: ID mentor yang menolak jadwal

## Flow Proses

### 1. Mentor Menolak Jadwal
```php
// Di Mentor/PermintaanMasukController.php
public function reject(Request $request, $scheduleId)
{
    $schedule->update([
        'status' => 'pending_admin_verification',
        'rejection_reason' => $request->rejection_reason
    ]);
    
    // Notifikasi ke admin
    Notification::create([
        'user_id' => $admin->id,
        'title' => 'Verifikasi Penolakan Diperlukan',
        'message' => "Mentor {$schedule->mentor->name} menolak jadwal...",
        'type' => 'rejection_verification_needed'
    ]);
}
```

### 2. Admin Verifikasi Penolakan

#### A. Admin Menyetujui Penolakan Mentor
```php
// Di Admin/VerificationController.php
public function approveRejection(Request $request, $scheduleId)
{
    $schedule->update(['status' => 'rejected']);
    
    // Notifikasi ke member
    Notification::create([
        'user_id' => $schedule->member_id,
        'title' => 'Jadwal Ditolak',
        'message' => "Jadwal Anda telah ditolak. Alasan: {$schedule->rejection_reason}"
    ]);
}
```

#### B. Admin Menolak Penolakan Mentor
```php
public function rejectRejection(Request $request, $scheduleId)
{
    $schedule->update([
        'status' => 'pending_approval',
        'rejection_reason' => null
    ]);
    
    // Notifikasi ke mentor untuk pertimbangan ulang
    Notification::create([
        'user_id' => $schedule->mentor_id,
        'title' => 'Penolakan Ditolak',
        'message' => "Penolakan Anda telah ditolak admin. Silakan pertimbangkan kembali."
    ]);
}
```

## Query untuk Mengambil Data

### 1. Semua Jadwal Pending Admin Verification
```php
$pendingVerifications = Schedule::where('status', 'pending_admin_verification')
    ->with(['member:id,name,email', 'mentor:id,name,email'])
    ->orderBy('created_at', 'desc')
    ->get();
```

### 2. Count untuk Dashboard Admin
```php
$verifikasiMentor = Schedule::where('status', 'pending_admin_verification')->count();
```

### 3. Data dengan Relasi Lengkap
```php
$schedules = Schedule::where('status', 'pending_admin_verification')
    ->with([
        'member:id,name,email',
        'mentor:id,name,email',
        'specialization:id,name'
    ])
    ->get();
```

## Routes yang Tersedia

```php
// routes/web.php
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('verification', [VerificationController::class, 'index'])->name('verification');
    Route::get('verifikasi-penolakan', [VerificationController::class, 'index'])->name('verification.index');
    Route::get('verifikasi/data', [VerificationController::class, 'getRejections'])->name('verification.data');
    Route::post('verification/approve/{scheduleId}', [VerificationController::class, 'approveRejection'])->name('verification.approve');
    Route::post('verification/reject/{scheduleId}', [VerificationController::class, 'rejectRejection'])->name('verification.reject');
});
```

## Frontend Integration

### 1. Halaman Admin Verification
- Route: `/admin/verification`
- Component: `Admin/VerificationPage`
- Data: `pendingVerifications`

### 2. API Endpoint
- GET `/admin/verifikasi/data` - Mengambil data penolakan
- POST `/admin/verification/approve/{scheduleId}` - Menyetujui penolakan
- POST `/admin/verification/reject/{scheduleId}` - Menolak penolakan

## Test Data

Untuk testing, gunakan seeder `TestPendingAdminVerificationSeeder`:

```bash
php artisan db:seed --class=TestPendingAdminVerificationSeeder
```

## Contoh Data Test

```php
[
    'Id_schedles' => 'SC999',
    'member_id' => 'U1',
    'mentor_id' => 'U2',
    'status' => 'pending_admin_verification',
    'rejection_reason' => 'Mentor menolak karena konflik jadwal, perlu verifikasi admin',
    'proposed_date' => '2025-10-25',
    'proposed_time' => '09:00:00'
]
```

## Notifikasi yang Dikirim

1. **Saat Mentor Menolak**: Notifikasi ke Admin
2. **Saat Admin Menyetujui Penolakan**: Notifikasi ke Member
3. **Saat Admin Menolak Penolakan**: Notifikasi ke Mentor

## Status Transisi

```
pending_approval → pending_admin_verification (mentor reject)
pending_admin_verification → rejected (admin approve rejection)
pending_admin_verification → pending_approval (admin reject rejection)
```

## Monitoring dan Logging

Gunakan ActivityLog untuk tracking:
```php
$schedule->logActivity('status_change', 'Status berubah ke pending_admin_verification', $schedule);
```

