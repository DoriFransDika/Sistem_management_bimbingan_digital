# 🔔 Notifikasi Seeder - Penjelasan & Panduan

## 📋 **RINGKASAN**

Seeder ini akan mengisi tabel `notifications` dengan **minimal 20 notifikasi** yang beragam dan realistis berdasarkan data yang sudah ada di database.

---

## ✅ **JENIS NOTIFIKASI YANG AKAN DIBUAT**

### **1. Schedule Confirmed** (5 notifikasi) ✅
- **User:** Member
- **Trigger:** Jadwal dikonfirmasi mentor
- **Isi:** Member mendapat notifikasi jadwalnya dikonfirmasi
- **Data:** Nama mentor, tanggal, waktu jadwal

### **2. Schedule Rejected** (3 notifikasi) ❌
- **User:** Member
- **Trigger:** Mentor menolak jadwal
- **Isi:** Member mendapat notifikasi jadwal ditolak
- **Data:** Nama mentor, alasan penolakan

### **3. Pending Admin Verification** (4 notifikasi) ⏳
- **User:** Member
- **Trigger:** Jadwal menunggu verifikasi admin
- **Isi:** Member mendapat notifikasi sedang menunggu verifikasi
- **Data:** Nama mentor, ID schedule

### **4. Rating Received** (4 notifikasi) ⭐
- **User:** Mentor
- **Trigger:** Mentor mendapat rating dari member
- **Isi:** Mentor mendapat notifikasi rating baru
- **Data:** Nama member, rating, review

### **5. Meeting Completed** (6 notifikasi - 3 untuk member, 3 untuk mentor) 🎉
- **User:** Member dan Mentor
- **Trigger:** Pertemuan selesai
- **Isi:** 
  - Member: "Jangan lupa berikan rating!"
  - Mentor: "Pertemuan selesai"
- **Data:** Nama lawan bicara, meeting ID

### **6. User Added** (2 notifikasi) 👤
- **User:** Admin
- **Trigger:** Member baru mendaftar
- **Isi:** Admin mendapat notifikasi member baru
- **Data:** Nama member, email, user ID

### **7. Remaining Sessions Low** (1 notifikasi) ⚠️
- **User:** Member
- **Trigger:** Sisa sesi ≤ 3
- **Isi:** Peringatan sisa sesi menipis
- **Data:** Jumlah sisa sesi

### **8. Welcome** (1 notifikasi) 👋
- **User:** Member baru
- **Trigger:** Member baru mendaftar
- **Isi:** Pesan selamat datang
- **Data:** Nama user

### **9. Course Recommendation** (1 notifikasi) 📚
- **User:** Member
- **Trigger:** Rekomendasi kursus
- **Isi:** Rekomendasi kursus sesuai profil
- **Data:** Nama kursus yang direkomendasikan

---

## 🎯 **TOTAL NOTIFIKASI**

**Minimal:** 20 notifikasi (bisa lebih tergantung data di database)
- Schedule Confirmed: 5
- Schedule Rejected: 3
- Pending Admin Verification: 4
- Rating Received: 4
- Meeting Completed: 6
- User Added: 2
- Remaining Sessions Low: 1
- Welcome: 1
- Course Recommendation: 1

**Total minimal:** 27 notifikasi (perhitungan: 5+3+4+4+6+2+1+1+1 = 27)

---

## 📊 **STRUKTUR DATA NOTIFIKASI**

Setiap notifikasi memiliki struktur berikut:

```php
[
    'user_id' => 'string',      // ID user yang menerima notifikasi
    'type' => 'string',         // Jenis notifikasi (schedule_confirmed, dll)
    'title' => 'string',        // Judul notifikasi
    'message' => 'text',        // Isi pesan notifikasi
    'data' => 'json',           // Data tambahan (JSON object)
    'is_read' => 'boolean',     // Status dibaca (false/true)
    'read_at' => 'timestamp',   // Waktu dibaca (nullable)
    'created_at' => 'timestamp', // Waktu dibuat
    'updated_at' => 'timestamp'  // Waktu update
]
```

**Contoh Data JSON:**
```json
{
    "schedule_id": "SC1",
    "mentor_name": "Rahman",
    "member_name": "Nadia Maharani",
    "date": "2024-01-20",
    "time": "10:00:00"
}
```

---

## 🚀 **CARA MENJALANKAN SEEDER**

### **Option 1: Fresh Database + Run All Seeders**
```bash
php artisan db:fresh --seed
```

### **Option 2: Run Notification Seeder Only**
```bash
php artisan db:seed --class=NotificationSeeder
```

### **Option 3: Reset & Seed Again**
```bash
# Jika ingin refresh notifikasi saja
php artisan tinker
# Kemudian jalankan di tinker:
$seeder = new \Database\Seeders\NotificationSeeder();
$seeder->run();
```

---

## 📝 **FITUR SEEDER**

### **✅ Auto-Generate dari Data Existing**

Seeder ini **secara otomatis** mengambil data dari:
- ✅ **User** - Semua user (member, mentor, admin)
- ✅ **Schedule** - Semua schedule dengan berbagai status
- ✅ **Rating** - Rating yang sudah ada
- ✅ **Meeting** - Meeting yang completed
- ✅ **Member Profile** - Untuk cek remaining sessions

### **✅ Realistis & Beragam**

- **Waktu:** Notifikasi dibuat dengan waktu berbeda-beda (subMinutes, subDays)
- **Status:** Gabungan notifikasi yang sudah dibaca dan belum dibaca
- **Variasi:** 9 jenis notifikasi berbeda
- **Real Data:** Menggunakan nama dan data yang sudah ada

### **✅ Informasi Detail**

Seeder akan menampilkan summary:
```
Created 27 notifications successfully!
Summary:
- Schedule Confirmed: 5
- Schedule Rejected: 3
- Pending Verification: 4
- Rating Received: 4
- Meeting Completed: 6
- User Added: 2
- Other types: 3
```

---

## 🔍 **CARA CEK NOTIFIKASI DI DATABASE**

### **Via Laravel Tinker**
```bash
php artisan tinker

# Count total
Notification::count();

# List notifikasi terbaru
Notification::latest()->take(10)->get();

# Notifikasi yang belum dibaca
Notification::unread()->count();

# Notifikasi per user
Notification::where('user_id', 'U5')->get();

# Notifikasi per type
Notification::where('type', 'schedule_confirmed')->get();
```

### **Via Database GUI**

Buka database viewer (phpMyAdmin, TablePlus, dll) dan query:
```sql
-- Lihat semua notifikasi
SELECT * FROM notifications ORDER BY created_at DESC;

-- Lihat notifikasi yang belum dibaca
SELECT * FROM notifications WHERE is_read = false;

-- Count per type
SELECT type, COUNT(*) as count FROM notifications GROUP BY type;

-- Count per user
SELECT user_id, COUNT(*) as count FROM notifications GROUP BY user_id;
```

---

## 🎨 **INTEGRASI DENGAN SISTEM**

Notifikasi yang sudah dibuat akan:

✅ **Otomatis muncul di Dashboard Admin**
- Stats: Total, Unread, Read, Today, This Week

✅ **Filterable di Halaman Notifikasi**
- By type
- By read/unread status
- Search by title/message

✅ **Real-time Update**
- Status read/unread bisa diupdate
- Mark as read (single/all)

---

## ⚠️ **CATATAN PENTING**

1. **Seeder ini bergantung pada data yang sudah ada**
   - User harus sudah ada (jalankan UserSeeder)
   - Schedule harus sudah ada (jalankan ConfirmedScheduleSeeder)
   - Rating harus sudah ada (jalankan RatingsSeeder)
   - Meeting harus sudah ada (jalankan MeetingSeeder)

2. **Jika data tidak mencukupi**
   - Seeder akan membuat notifikasi sebanyak data yang tersedia
   - Tidak akan error, hanya akan membuat notifikasi sejumlah yang tersedia

3. **Untuk hasil optimal**
   - Jalankan semua seeder terlebih dahulu
   - Kemudian jalankan NotificationSeeder

4. **Refresh Notifikasi**
   - Jika ingin mengulang dengan data terbaru
   - Hapus dulu data lama di tabel notifications
   - Kemudian jalankan seeder lagi

---

## 📊 **MAPPING NOTIFIKASI DENGAN FITUR**

| Jenis Notifikasi | Fitur yang Menggunakan |
|------------------|------------------------|
| schedule_confirmed | Dashboard Admin, Notifikasi Popup |
| schedule_rejected | Verifikasi, Dashboard Admin |
| pending_admin_verification | Verifikasi Penolakan |
| rating_received | Dashboard Mentor, Notifikasi |
| meeting_completed | Riwayat, Dashboard |
| user_added | Dashboard Admin, Log Activity |
| remaining_sessions_low | Dashboard Member, Alert |
| welcome | Dashboard Member |
| course_recommendation | Dashboard Member, Content |

---

## ✅ **KESIMPULAN**

Seeder ini akan membuat **minimal 20 notifikasi** dengan:
- ✅ 9 jenis notifikasi berbeda
- ✅ Data realistis dari database
- ✅ Variasi waktu (hari ini, minggu lalu, dll)
- ✅ Status read/unread bervariasi
- ✅ Integrasi dengan semua fitur sistem

**Hasil:** Sistem notifikasi penuh dengan data untuk testing dan development!


