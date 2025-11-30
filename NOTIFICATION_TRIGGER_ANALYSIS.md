# 🔔 Analisis Notifikasi - Trigger, Data, dan Relasi

## 📋 **RINGKASAN**

Dokumen ini menjelaskan **semua tempat** dimana notifikasi dibuat, **action yang memicu** notifikasi, dan **data relasi** yang digunakan.

---

## 🎯 **NOTIFIKASI DIBUAT OTOMATIS**

Notifikasi dibuat **secara OTOMATIS** ketika ada **ACTION** dari user di sistem.

---

## 1️⃣ **MENTOR: TERIMA JADWAL** 📥

### **Controller:** `app/Http/Controllers/Mentor/PermintaanMasukController.php`
### **Method:** `accept()`

### **Action:**
Mentor mengklik tombol "Terima" pada permintaan jadwal dari member.

### **Database Update:**
```php
schedules:
  UPDATE status = 'approved'
  WHERE id = $scheduleId
```

### **Notifikasi yang Dibuat (2 buah):**

**1. Notifikasi untuk MEMBER:**
```php
Notification::create([
    'user_id' => $schedule->member_id,
    'title' => 'Jadwal Diterima',
    'message' => "Jadwal Anda dengan mentor {$schedule->mentor->name} pada {$schedule->proposed_date} telah diterima.",
    'type' => 'schedule_approved',
    'read' => false
]);
```

**Data yang Digunakan:**
- ✅ `$schedule->member_id` → FK ke users
- ✅ `$schedule->mentor->name` → Dari relasi schedule→mentor→users
- ✅ `$schedule->proposed_date` → Dari schedule

**Relasi:**
```
schedules → member_id → users (member)
schedules → mentor_id → users (mentor) → name
```

---

**2. Notifikasi untuk ADMIN:**
```php
Notification::create([
    'user_id' => $admin->id,
    'title' => 'Jadwal Baru Dikonfirmasi',
    'message' => "Mentor {$schedule->mentor->name} telah menerima jadwal dengan member {$schedule->member->name} pada {$schedule->proposed_date}.",
    'type' => 'schedule_confirmed',
    'read' => false
]);
```

**Data yang Digunakan:**
- ✅ `$admin->id` → Query users WHERE role='admin'
- ✅ `$schedule->mentor->name` → Dari relasi
- ✅ `$schedule->member->name` → Dari relasi
- ✅ `$schedule->proposed_date` → Dari schedule

**Relasi:**
```
users → WHERE role='admin' → id
schedules → mentor_id → users (mentor) → name
schedules → member_id → users (member) → name
```

---

## 2️⃣ **MENTOR: TOLAK JADWAL** ❌

### **Controller:** `app/Http/Controllers/Mentor/PermintaanMasukController.php`
### **Method:** `reject()`

### **Action:**
Mentor mengklik tombol "Tolak" dan mengisi alasan penolakan.

### **Database Update:**
```php
schedules:
  UPDATE status = 'pending_admin_verification'
  UPDATE rejection_reason = $request->rejection_reason
  WHERE id = $scheduleId
```

### **Notifikasi yang Dibuat (1 buah):**

**Notifikasi untuk ADMIN:**
```php
Notification::create([
    'user_id' => $admin->id,
    'title' => 'Verifikasi Penolakan Diperlukan',
    'message' => "Mentor {$schedule->mentor->name} menolak jadwal dengan member {$schedule->member->name} pada {$schedule->proposed_date}. Alasan: {$request->rejection_reason}",
    'type' => 'rejection_verification_needed',
    'read' => false
]);
```

**Data yang Digunakan:**
- ✅ `$admin->id` → Query users WHERE role='admin'
- ✅ `$schedule->mentor->name` → Dari relasi
- ✅ `$schedule->member->name` → Dari relasi
- ✅ `$schedule->proposed_date` → Dari schedule
- ✅ `$request->rejection_reason` → Input dari mentor

**Relasi:**
```
users → WHERE role='admin' → id
schedules → mentor_id → users (mentor) → name
schedules → member_id → users (member) → name
request → rejection_reason (input form)
```

---

## 3️⃣ **ADMIN: SETUJUI PENOLAKAN** ✅

### **Controller:** `app/Http/Controllers/Admin/VerificationController.php`
### **Method:** `approveRejection()`

### **Action:**
Admin mengklik tombol "Setujui" pada halaman Verifikasi Penolakan.

### **Database Update:**
```php
schedules:
  UPDATE status = 'rejected'
  WHERE id = $scheduleId
```

### **Notifikasi yang Dibuat (1 buah):**

**Notifikasi untuk MEMBER:**
```php
Notification::create([
    'user_id' => $schedule->member_id,
    'title' => 'Jadwal Ditolak',
    'message' => "Jadwal Anda dengan mentor {$schedule->mentor->name} pada {$schedule->proposed_date} telah ditolak. Alasan: {$schedule->rejection_reason}",
    'type' => 'schedule_rejected',
    'read' => false
]);
```

**Data yang Digunakan:**
- ✅ `$schedule->member_id` → FK ke users
- ✅ `$schedule->mentor->name` → Dari relasi
- ✅ `$schedule->proposed_date` → Dari schedule
- ✅ `$schedule->rejection_reason` → Dari schedule

**Relasi:**
```
schedules → member_id → users (member)
schedules → mentor_id → users (mentor) → name
schedules → proposed_date
schedules → rejection_reason
```

---

## 4️⃣ **ADMIN: TOLAK PENOLAKAN** ❌

### **Controller:** `app/Http/Controllers/Admin/VerificationController.php`
### **Method:** `rejectRejection()`

### **Action:**
Admin mengklik tombol "Tolak" pada halaman Verifikasi Penolakan (menolak penolakan mentor, artinya jadwal dikembalikan ke mentor).

### **Database Update:**
```php
schedules:
  UPDATE status = 'pending_approval'
  UPDATE rejection_reason = null
  WHERE id = $scheduleId
```

### **Notifikasi yang Dibuat (1 buah):**

**Notifikasi untuk MENTOR:**
```php
Notification::create([
    'user_id' => $schedule->mentor_id,
    'title' => 'Penolakan Ditolak',
    'message' => "Penolakan Anda untuk jadwal dengan member {$schedule->member->name} telah ditolak admin. Silakan pertimbangkan kembali.",
    'type' => 'rejection_rejected',
    'read' => false
]);
```

**Data yang Digunakan:**
- ✅ `$schedule->mentor_id` → FK ke users
- ✅ `$schedule->member->name` → Dari relasi

**Relasi:**
```
schedules → mentor_id → users (mentor)
schedules → member_id → users (member) → name
```

---

## 📊 **RINGKASAN SEMUA TRIGGER NOTIFIKASI**

| No | Action/Trigger | Controller | Method | Notifikasi Untuk | Type |
|----|----------------|------------|--------|------------------|------|
| 1 | Mentor Terima Jadwal | PermintaanMasukController | accept() | Member & Admin | schedule_approved, schedule_confirmed |
| 2 | Mentor Tolak Jadwal | PermintaanMasukController | reject() | Admin | rejection_verification_needed |
| 3 | Admin Setujui Penolakan | VerificationController | approveRejection() | Member | schedule_rejected |
| 4 | Admin Tolak Penolakan | VerificationController | rejectRejection() | Mentor | rejection_rejected |

---

## 🔗 **RELASI DATA YANG DIGUNAKAN**

### **Tabel Utama:**
1. **`schedules`** - Core table untuk jadwal
2. **`users`** - Data member, mentor, admin
3. **`request`** - Input dari form

### **Relasi Schedule:**
```
schedules:
  ├── member_id → users (member)
  ├── mentor_id → users (mentor)
  ├── proposed_date
  ├── rejection_reason
  └── status
```

### **Relasi User:**
```
users:
  ├── id (PK)
  ├── name
  ├── role ('member', 'mentor', 'admin')
  └── email
```

---

## 📋 **FLOW NOTIFIKASI LENGKAP**

### **Scenario 1: Mentor Terima Jadwal**
```
1. Member buat jadwal → schedules (status='pending_approval')
2. Mentor terima → schedules (status='approved')
   ↓
   Notification untuk Member (Jadwal Diterima)
   Notification untuk Admin (Jadwal Dikonfirmasi)
```

### **Scenario 2: Mentor Tolak Jadwal**
```
1. Member buat jadwal → schedules (status='pending_approval')
2. Mentor tolak + isi alasan → schedules (status='pending_admin_verification')
   ↓
   Notification untuk Admin (Verifikasi Penolakan Diperlukan)
3a. Admin setujui penolakan → schedules (status='rejected')
    ↓
    Notification untuk Member (Jadwal Ditolak)
3b. Admin tolak penolakan → schedules (status='pending_approval')
    ↓
    Notification untuk Mentor (Penolakan Ditolak)
```

---

## ⚠️ **CATATAN PENTING**

### **Notifikasi OTOMATIS:**
- ✅ Dibuat secara otomatis ketika ada action
- ✅ Tidak perlu manual input dari user
- ✅ Data diambil dari relasi database

### **Data yang Digunakan:**
- ✅ **Nama user** → Dari relasi `schedules→users`
- ✅ **Tanggal/waktu** → Dari kolom `proposed_date` di schedules
- ✅ **Alasan** → Dari `rejection_reason` atau input form
- ✅ **Status** → Dari kolom `status` di schedules

### **Where Notifikasi Dibuat:**
1. ✅ **Mentor Controller** → accept(), reject()
2. ✅ **Admin Controller** → approveRejection(), rejectRejection()

### **Notifikasi Manual:**
- ✅ Admin bisa membuat notifikasi manual via `NotificationController::create()`
- ✅ Seeder juga bisa membuat notifikasi untuk testing

---

## 🎯 **KESIMPULAN**

### **4 Trigger Utama Notifikasi:**

1. **Mentor Terima Jadwal** → Notif untuk Member + Admin
2. **Mentor Tolak Jadwal** → Notif untuk Admin
3. **Admin Setujui Penolakan** → Notif untuk Member
4. **Admin Tolak Penolakan** → Notif untuk Mentor

### **Data Sumber:**
- ✅ Tabel `schedules` (main data)
- ✅ Tabel `users` (nama member/mentor)
- ✅ Input form (alasan penolakan)

### **Model Notification:**
- ❌ **TIDAK punya relasi** dengan tabel lain (tidak ada foreign key)
- ✅ Hanya menyimpan data dalam bentuk JSON `data`
- ✅ Kolom: `type`, `title`, `message`, `data`, `is_read`, `read_at`

**Total notifikasi otomatis:** 4 notifikasi per action (bisa 1-2 notifikasi per action tergantung trigger)


