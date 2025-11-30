# Analisis Halaman Verifikasi dan Notifikasi - Database Tables

## 📋 **Ringkasan: SEMUA DATA DIAMBIL DARI DATABASE**

Setelah analisis mendalam terhadap controller untuk Verification dan Notification, berikut adalah rincian lengkap:

---

## 🔴 **HALAMAN 1: VERIFIKASI PENOLAKAN**

### **Controller:** `app/Http/Controllers/Admin/VerificationController.php`

### ✅ **1. Index - Menampilkan Jadwal yang Perlu Diverifikasi**

**Kode:**
```php
$pendingVerifications = Schedule::where('status', 'pending_admin_verification')
    ->with(['member:id_user,name,email', 'mentor:id_user,name,email'])
    ->orderBy('created_at', 'desc')
    ->get();
```

**Database Tables Yang Digunakan:**

1. **`schedules`** (Primary Table)
   - Filter: `status = 'pending_admin_verification'`
   - Kolom yang digunakan:
     - `Id_schedles` (primary key)
     - `member_id`, `mentor_id`
     - `proposed_date`, `proposed_time`
     - `training_type`
     - `materi_modul`, `materi_topik`, `materi_sub_topik`
     - `rejection_reason`
     - `status`
     - `created_at`
   - Order by: `created_at DESC`

2. **`users`** (Via relationships)
   - Relationship sebagai member: `member_id` → `users.id_user`
   - Relationship sebagai mentor: `mentor_id` → `users.id_user`
   - Kolom yang diambil: `id_user`, `name`, `email`

**Data yang Dikirim ke Frontend:**
- Semua schedule dengan status pending_admin_verification
- Dengan informasi member dan mentor (name, email)
- Terurut dari yang terbaru

---

### ✅ **2. Get Rejections - Ambil Data Penolakan (API)**

**Kode:**
```php
$rejections = Schedule::where('status', 'pending_admin_verification')
    ->with(['member:id_user,name', 'mentor:id_user,name'])
    ->orderBy('created_at', 'desc')
    ->get();
```

**Database Tables:** Same as Index
- **`schedules`** - WHERE status = 'pending_admin_verification'
- **`users`** - Via relationships (member dan mentor)

**Purpose:** Mengambil data yang sama seperti index tapi via API call untuk refresh

---

### ✅ **3. Approve Rejection - Admin Menyetujui Penolakan Mentor**

**Kode:**
```php
$schedule->update(['status' => 'rejected']);

Notification::create([
    'user_id' => $schedule->member_id,
    'title' => 'Jadwal Ditolak',
    'message' => "...",
    'type' => 'schedule_rejected',
    'read' => false
]);
```

**Database Operations:**

1. **Update `schedules`**
   - Kolom: `status` → 'rejected'
   - WHERE: `Id_schedles = $scheduleId`

2. **Insert ke `notifications`**
   - Kolom:
     - `user_id` → member_id dari schedule
     - `title` → 'Jadwal Ditolak'
     - `message` → informasi lengkap
     - `type` → 'schedule_rejected'
     - `is_read` → false

**Kolom yang Diupdate/Insert:**

**Tabel `schedules`:**
```php
[
    'status' => 'rejected' // UPDATE
]
```

**Tabel `notifications`:**
```php
[
    'user_id' => $schedule->member_id,
    'title' => 'Jadwal Ditolak',
    'message' => "Jadwal Anda dengan mentor {$schedule->mentor->name} pada {$schedule->proposed_date} telah ditolak. Alasan: {$schedule->rejection_reason}",
    'type' => 'schedule_rejected',
    'is_read' => false,
    'created_at' => now(),
]
```

**Flow:**
1. Admin setuju dengan penolakan mentor
2. Status schedule diubah ke 'rejected'
3. Member diberi notifikasi bahwa jadwalnya ditolak

---

### ✅ **4. Reject Rejection - Admin Menolak Penolakan Mentor**

**Kode:**
```php
$schedule->update([
    'status' => 'pending_approval',
    'rejection_reason' => null
]);

Notification::create([
    'user_id' => $schedule->mentor_id,
    'title' => 'Penolakan Ditolak',
    'message' => "...",
    'type' => 'rejection_rejected',
    'read' => false
]);
```

**Database Operations:**

1. **Update `schedules`**
   - Kolom:
     - `status` → 'pending_approval' (kembali ke mentor untuk approval)
     - `rejection_reason` → null (dihapus)

2. **Insert ke `notifications`**
   - Kolom:
     - `user_id` → mentor_id dari schedule
     - `title` → 'Penolakan Ditolak'
     - `message` → informasi lengkap
     - `type` → 'rejection_rejected'
     - `is_read` → false

**Kolom yang Diupdate/Insert:**

**Tabel `schedules`:**
```php
[
    'status' => 'pending_approval', // UPDATE - kembali ke mentor
    'rejection_reason' => null // UPDATE - dihapus
]
```

**Tabel `notifications`:**
```php
[
    'user_id' => $schedule->mentor_id,
    'title' => 'Penolakan Ditolak',
    'message' => "Penolakan Anda untuk jadwal dengan member {$schedule->member->name} telah ditolak admin. Silakan pertimbangkan kembali.",
    'type' => 'rejection_rejected',
    'is_read' => false,
    'created_at' => now(),
]
```

**Flow:**
1. Admin tidak setuju dengan penolakan mentor
2. Status schedule dikembalikan ke 'pending_approval'
3. Alasan penolakan dihapus
4. Mentor diberi notifikasi bahwa penolakannya ditolak

---

## 🔵 **HALAMAN 2: MANAJEMEN NOTIFIKASI**

### **Controller:** `app/Http/Controllers/Admin/NotificationController.php`

### ✅ **1. Index - Halaman Notifikasi**

**Kode:**
```php
$notifications = Notification::orderBy('created_at', 'desc')->paginate(20);
```

**Database Table:** `notifications`

**Kolom yang Digunakan:**
- `id` (primary key)
- `type` - Jenis notifikasi
- `title` - Judul notifikasi
- `message` - Isi pesan
- `data` - Data tambahan (JSON)
- `is_read` - Status dibaca (boolean)
- `read_at` - Waktu dibaca (datetime)
- `user_id` - Pemilik notifikasi
- `created_at`, `updated_at`

**Features:**
- Pagination: 20 items per page
- Order by: `created_at DESC`

**Data yang Dikirim:**
```json
{
    "notifications": [...],
    "pagination": {
        "current_page": 1,
        "last_page": 5,
        "per_page": 20,
        "total": 100
    }
}
```

---

### ✅ **2. Get Notifications - Ambil Data Notifikasi dengan Filter (API)**

**Kode:**
```php
$query = Notification::orderBy('created_at', 'desc');

// Search filter
if ($request->has('search')) {
    $query->where(function ($q) use ($search) {
        $q->where('title', 'like', "%{$search}%")
          ->orWhere('message', 'like', "%{$search}%");
    });
}

// Type filter
if ($request->has('type')) {
    $query->where('type', $type);
}

// Status filter (read/unread)
if ($request->has('status')) {
    if ($status === 'unread') {
        $query->where('is_read', false);
    } else if ($status === 'read') {
        $query->where('is_read', true);
    }
}

$notifications = $query->paginate(20);
$unreadCount = Notification::unread()->count();
```

**Database Table:** `notifications`

**Kolom yang Digunakan:**
- `id`
- `type` - Filter by type
- `title` - Search
- `message` - Search
- `is_read` - Filter read/unread status
- `created_at` - Order by

**Features:**
- ✅ Search: `title`, `message`
- ✅ Filter by type: `type`
- ✅ Filter by status: `is_read` (true/false)
- ✅ Pagination: 20 per page
- ✅ Unread count: Total unread notifications

**Data yang Dikirim:**
```json
{
    "data": [...],
    "unread_count": 5,
    "pagination": {...}
}
```

---

### ✅ **3. Mark As Read - Tandai Satu Notifikasi Sudah Dibaca**

**Kode:**
```php
$notification = Notification::findOrFail($id);
$notification->markAsRead();
```

**Database Operations:**

**Update `notifications`:**
```php
[
    'is_read' => true,
    'read_at' => now()
]
WHERE id = $id
```

**Method `markAsRead()`:**
```php
public function markAsRead()
{
    $this->update([
        'is_read' => true,
        'read_at' => now()
    ]);
}
```

---

### ✅ **4. Mark All As Read - Tandai Semua Notifikasi Sudah Dibaca**

**Kode:**
```php
Notification::markAllAsRead();
```

**Database Operations:**

**Update `notifications`:**
```php
[
    'is_read' => true,
    'read_at' => now()
]
WHERE is_read = false
```

**Static Method `markAllAsRead()`:**
```php
public static function markAllAsRead()
{
    self::where('is_read', false)->update([
        'is_read' => true,
        'read_at' => now()
    ]);
}
```

---

### ✅ **5. Create Notification - Buat Notifikasi Baru**

**Kode:**
```php
$validatedData = $request->validate([
    'type' => 'required|string',
    'title' => 'required|string|max:255',
    'message' => 'required|string',
    'data' => 'nullable|array'
]);

$notification = Notification::create($validatedData);
```

**Database Operations:**

**Insert ke `notifications`:**
```php
[
    'type' => $validatedData['type'],
    'title' => $validatedData['title'],
    'message' => $validatedData['message'],
    'data' => $validatedData['data'], // JSON
    'is_read' => false, // Default
    'created_at' => now(),
    'updated_at' => now(),
]
```

---

### ✅ **6. Get Stats - Statistik Notifikasi**

**Kode:**
```php
$stats = [
    'total' => Notification::count(),
    'unread' => Notification::unread()->count(),
    'read' => Notification::read()->count(),
    'today' => Notification::whereDate('created_at', today())->count(),
    'this_week' => Notification::whereBetween('created_at', [
        now()->startOfWeek(),
        now()->endOfWeek()
    ])->count(),
];
```

**Database Table:** `notifications`

**Kolom yang Digunakan:**
- `id` - Untuk count
- `is_read` - Filter unread/read
- `created_at` - Filter today/this week

**Queries:**

1. **Total:** `SELECT COUNT(*) FROM notifications`

2. **Unread:** `SELECT COUNT(*) FROM notifications WHERE is_read = false`

3. **Read:** `SELECT COUNT(*) FROM notifications WHERE is_read = true`

4. **Today:** `SELECT COUNT(*) FROM notifications WHERE DATE(created_at) = CURDATE()`

5. **This Week:** `SELECT COUNT(*) FROM notifications WHERE created_at BETWEEN start_of_week AND end_of_week`

**Data yang Dikirim:**
```json
{
    "total": 150,
    "unread": 12,
    "read": 138,
    "today": 5,
    "this_week": 45
}
```

---

## 📊 **RINGKASAN DATABASE TABLES**

### **Halaman Verifikasi:**

1. **`schedules`** - Jadwal yang perlu diverifikasi
   - Kolom: `Id_schedles`, `member_id`, `mentor_id`, `status`, `rejection_reason`, `proposed_date`, `proposed_time`, `training_type`, `created_at`
   - Filter: `status = 'pending_admin_verification'`

2. **`users`** - Data member dan mentor
   - Kolom: `id_user`, `name`, `email`
   - Relationship: Via `member_id` dan `mentor_id`

3. **`notifications`** - Notifikasi untuk member/mentor
   - Kolom: `user_id`, `title`, `message`, `type`, `is_read`, `created_at`

### **Halaman Notifikasi:**

1. **`notifications`** - Tabel utama notifikasi
   - Primary Key: `id`
   - Kolom: `type`, `title`, `message`, `data` (JSON), `is_read`, `read_at`, `user_id`, `created_at`, `updated_at`
   - Scopes: `unread()`, `read()`
   - Methods: `markAsRead()`, `markAllAsRead()`

---

## ✅ **KESIMPULAN**

### **Semua Data DIAMBIL DARI DATABASE ✓**

| Halaman | Tabel Database | Status |
|---------|---------------|---------|
| Verifikasi Penolakan | `schedules`, `users`, `notifications` | ✅ Real Data |
| Manajemen Notifikasi | `notifications` | ✅ Real Data |

### **Verifikasi Penolakan:**

**Database Tables:**
1. **`schedules`** - READ (list pending) + UPDATE (approve/reject action)
   - Kolom: `status`, `rejection_reason`
2. **`users`** - READ (via relationship)
3. **`notifications`** - INSERT (create notification saat approve/reject)

**Flow:**
- **Approve:** Schedule status → 'rejected', create notification untuk member
- **Reject:** Schedule status → 'pending_approval', rejection_reason → null, create notification untuk mentor

### **Manajemen Notifikasi:**

**Database Table:** `notifications`
- **READ:** List, search, filter, pagination
- **UPDATE:** Mark as read (single/all)
- **INSERT:** Create notification
- **Statistics:** Count total, unread, read, today, this week

**Features:**
- Search: title, message
- Filter: type, status (read/unread)
- Pagination: 20 per page
- Statistics: Total, unread, read, today, this week

---

**Tidak ada data hardcoded. Semua data berasal dari database.**


