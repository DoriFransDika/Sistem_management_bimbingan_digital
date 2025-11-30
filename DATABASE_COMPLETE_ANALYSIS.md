# 📊 Analisis Lengkap Database & Relasi - Sistem Manajemen Bimbingan Digital

## 🎯 **RINGKASAN EXECUTIVE**

Sistem ini menggunakan **19 tabel database** dengan relasi kompleks untuk mendukung semua fitur dari **Welcome Page**, **Autentikasi**, **Dashboard Admin**, **Manajemen Member/Mentor**, **Verifikasi**, **Riwayat**, dan **Notifikasi**.

---

## 📋 **DAFTAR SEMUA TABEL DATABASE**

### ✅ **1. TABEL UTAMA**

| No | Nama Tabel | Primary Key | Deskripsi |
|----|------------|-------------|-----------|
| 1 | `users` | `id_user` | Tabel user utama (admin, mentor, member) |
| 2 | `member_profiles` | `Id_member` | Profil lengkap member |
| 3 | `mentor_profiles` | `Id_mentor` | Profil lengkap mentor |
| 4 | `specializations` | `Id_specializations` | Data jenis pelatihan/spesialisasi |
| 5 | `available_days` | `Id_day` | Data hari yang tersedia |
| 6 | `schedules` | `Id_schedles` | Jadwal pertemuan |
| 7 | `meetings` | `id` | Data pertemuan yang telah disetujui |
| 8 | `meeting_history` | `id` | Riwayat pertemuan yang selesai |
| 9 | `ratings` | `id_rating` | Rating dan review |
| 10 | `notifications` | `id` | Sistem notifikasi |
| 11 | `materi` | `id_materi` | Materi pembelajaran |
| 12 | `reports` | `id` | Laporan pertemuan |
| 13 | `activity_logs` | `id` | Log aktivitas |
| 14 | `sessions` | `id` | Session login |
| 15 | `password_reset_tokens` | `email` | Reset password |
| 16 | `cache` | `key` | Cache system |
| 17 | `jobs` | `id` | Queue jobs |
| 18 | `mentor_specializations` | composite | Pivot table (tidak digunakan) |
| 19 | `mentor_available_days` | composite | Pivot table (tidak digunakan) |

---

## 🔗 **RELASI ANTAR TABEL**

### **Struktur Hierarki Relasi:**

```
users (CORE)
├── member_profiles (1:1)
│   └── specializations (N:1)
├── mentor_profiles (1:1)
│   ├── specializations (N:1 via JSON) 
│   └── available_days (N:1 via JSON)
├── schedules (1:N sebagai member)
├── schedules (1:N sebagai mentor)
├── meetings (1:N sebagai member)
├── meetings (1:N sebagai mentor)
├── ratings (1:N sebagai member)
├── ratings (1:N sebagai mentor)
├── notifications (1:N)
└── activity_logs (1:N)

schedules
├── member (N:1) → users
├── mentor (N:1) → users
├── specialization (N:1) → specializations
└── materi (N:1) → materi

meetings
├── member (N:1) → users
└── mentor (N:1) → users
```

---

## 📊 **DETAIL TIAP TABEL & KOLOM YANG DIGUNAKAN**

### **1. TABEL `users`** ⭐ (CORE TABLE)

**Primary Key:** `id_user` (STRING)
**Increment:** FALSE (Format: 'U1', 'U2', dll)

**Kolom:**
| Kolom | Tipe | Kegunaan |
|-------|------|----------|
| `id_user` | string(20) | Primary key, auto-generated 'U{n}' |
| `name` | string | Nama lengkap user |
| `email` | string | Email (unique) |
| `email_verified_at` | timestamp | Waktu verifikasi email |
| `password` | string | Password (hashed) |
| `role` | enum | 'admin', 'mentor', 'member' |
| `status` | enum | 'active', 'inactive', 'pending' |
| `remember_token` | string | Remember me token |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu update |

**Digunakan di:**
- ✅ Welcome Page
- ✅ Login/Logout (Authentication)
- ✅ Dashboard Admin (Total Member, Total Mentor, Rating)
- ✅ Member Management
- ✅ Mentor Management
- ✅ Verifikasi
- ✅ Riwayat Pertemuan
- ✅ Notifikasi

---

### **2. TABEL `member_profiles`** 📝

**Primary Key:** `Id_member` (STRING)
**Increment:** FALSE (Format: 'MB1', 'MB2', dll)
**Foreign Key:** `user_id` → `users.id_user`

**Kolom:**
| Kolom | Tipe | Kegunaan |
|-------|------|----------|
| `Id_member` | string(20) | Primary key, auto 'MB{n}' |
| `user_id` | string(20) | FK ke users.id_user |
| `phone` | string(20) | Nomor telepon |
| `meeting_type` | string | 'Daring' atau 'Luring' |
| `Id_specializations` | string(20) | FK ke specializations |
| `remaining_sessions` | integer | Sisa sesi pembelajaran |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Relasi:**
- BelongsTo: `users` (user)
- BelongsTo: `specializations` (specialization)

**Digunakan di:**
- ✅ Dashboard Admin (training type filter)
- ✅ Member Management (CRUD)
- ✅ Member Statistics (Daring/Luring count)

---

### **3. TABEL `mentor_profiles`** 👨‍🏫

**Primary Key:** `Id_mentor` (STRING)
**Increment:** FALSE (Format: 'MT1', 'MT2', dll)
**Foreign Key:** `user_id` → `users.id_user`

**Kolom:**
| Kolom | Tipe | Kegunaan |
|-------|------|----------|
| `Id_mentor` | string(20) | Primary key, auto 'MT{n}' |
| `user_id` | string(20) | FK ke users.id_user |
| `phone` | string(20) | Nomor telepon |
| `specialization_ids` | json | Array of Id_specializations |
| `available_day_ids` | json | Array of Id_day |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Khusus:** Kolom JSON (`specialization_ids`, `available_day_ids`) menyimpan array ID

**Digunakan di:**
- ✅ Dashboard Admin (mentor sessions, ratings)
- ✅ Mentor Management (CRUD)
- ✅ Filter by specialization & available days

---

### **4. TABEL `specializations`** 🎓

**Primary Key:** `Id_specializations` (STRING)

**Kolom:**
| Kolom | Tipe | Kegunaan |
|-------|------|----------|
| `Id_specializations` | string(20) | Primary key |
| `name` | string | Nama pelatihan (e.g., 'Web Programming Basic') |
| `description` | text | Deskripsi pelatihan |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Nilai:** 'Administrasi Perkantoran', 'Graphic Design', 'Web Programming Basic', 'UI/UX Design'

**Digunakan di:**
- ✅ Dashboard Admin (training type di reviews)
- ✅ Member Management (training type dropdown)
- ✅ Mentor Management (filter specialization)
- ✅ Welcome Page (menampilkan pelatihan tersedia)

---

### **5. TABEL `available_days`** 📅

**Primary Key:** `Id_day` (STRING)

**Kolom:**
| Kolom | Tipe | Kegunaan |
|-------|------|----------|
| `Id_day` | string(20) | Primary key |
| `name` | string | Nama hari (e.g., 'Senin', 'Selasa') |
| `sort_order` | integer | Urutan tampil |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Digunakan di:**
- ✅ Mentor Management (filter available days)
- ✅ Form create/edit mentor

---

### **6. TABEL `schedules`** 📆⭐ (VERY IMPORTANT)

**Primary Key:** `Id_schedles` (STRING)
**Increment:** FALSE (Format: 'SC1', 'SC2', dll)
**Foreign Keys:** `member_id`, `mentor_id`, `Id_specializations`, `materi_id`

**Kolom:**
| Kolom | Tipe | Kegunaan |
|-------|------|----------|
| `Id_schedles` | string(20) | Primary key, auto 'SC{n}' |
| `member_id` | string(20) | FK ke users.id_user |
| `mentor_id` | string(20) | FK ke users.id_user |
| `Id_specializations` | string(20) | FK ke specializations |
| `materi_id` | string(20) | FK ke materi.id_materi |
| `training_type` | enum | 'Daring', 'Luring' |
| `proposed_date` | date | Tanggal yang diajukan |
| `proposed_time` | time | Waktu yang diajukan |
| `status` | enum | 'pending', 'pending_approval', 'pending_admin_verification', 'confirmed', 'rejected', 'completed', 'cancelled' |
| `rejection_reason` | text | Alasan penolakan (jika ditolak) |
| `materi_modul` | string | Modul materi |
| `materi_topik` | string | Topik materi |
| `materi_sub_topik` | string | Sub topik materi |
| `dokumentasi` | string | Link dokumentasi |
| `laporan_dikirim_at` | timestamp | Waktu laporan dikirim |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Relasi:**
- BelongsTo: `users` (member, mentor)
- BelongsTo: `specializations` (specialization)
- BelongsTo: `materi` (materi)

**Digunakan di:**
- ✅ Dashboard Admin (Verifikasi Mentor count)
- ✅ Verifikasi Penolakan (CRUD)
- ✅ Riwayat Pertemuan (status completed)
- ✅ Mentor: Permintaan Masuk
- ✅ Member: Jadwal Saya

**Status Flow:**
```
pending → pending_approval → confirmed → completed
                           ↓
              pending_admin_verification → rejected
```

---

### **7. TABEL `meetings`** 🤝

**Primary Key:** `id` (AUTO INCREMENT)

**Kolom:**
| Kolom | Tipe | Kegunaan |
|-------|------|----------|
| `id` | bigint | Primary key |
| `member_id` | string(20) | FK ke users.id_user |
| `mentor_id` | string(20) | FK ke users.id_user |
| `schedule` | datetime | Waktu pertemuan |
| `status` | enum | 'pending', 'confirmed', 'ongoing', 'completed', 'cancelled' |
| `topic` | string | Topik pertemuan |
| `notes` | text | Catatan mentor |
| `feedback` | text | Feedback member |
| `rating` | decimal | Rating (1-5) |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Relasi:**
- BelongsTo: `users` (member, mentor)

**Digunakan di:**
- ✅ Dashboard Admin (Status Pertemuan chart)
- ✅ Dashboard Admin (Sesi Pembelajaran per Mentor)
- ✅ Riwayat Pertemuan
- ✅ Member: Riwayat Saya
- ✅ Mentor: Pertemuan Selesai

---

### **8. TABEL `ratings`** ⭐

**Primary Key:** `id_rating` (STRING)
**Increment:** FALSE (Format: 'RT1', 'RT2', dll)

**Kolom:**
| Kolom | Tipe | Kegunaan |
|-------|------|----------|
| `id_rating` | string(20) | Primary key, auto 'RT{n}' |
| `mentor_id` | string(20) | FK ke users.id_user |
| `member_id` | string(20) | FK ke users.id_user |
| `rating` | decimal(1) | Nilai rating (1-5) |
| `review` | text | Ulasan/komentar |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Relasi:**
- BelongsTo: `users` (member, mentor)

**Digunakan di:**
- ✅ Dashboard Admin (Recent Reviews)
- ✅ Dashboard Admin (Mentor Ratings chart)
- ✅ Member: Beri Rating
- ✅ Mentor: Lihat Rating Saya

---

### **9. TABEL `notifications`** 🔔

**Primary Key:** `id` (AUTO INCREMENT)

**Kolom:**
| Kolom | Tipe | Kegunaan |
|-------|------|----------|
| `id` | bigint | Primary key |
| `user_id` | string(20) | FK ke users.id_user |
| `type` | string | Jenis notifikasi |
| `title` | string | Judul notifikasi |
| `message` | text | Isi pesan |
| `data` | json | Data tambahan |
| `is_read` | boolean | Status dibaca |
| `read_at` | timestamp | Waktu dibaca |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Relasi:**
- BelongsTo: `users` (user)

**Scopes:**
- `unread()` - WHERE is_read = false
- `read()` - WHERE is_read = true

**Methods:**
- `markAsRead()` - Set is_read = true, read_at = now()
- `markAllAsRead()` - Set semua is_read = true

**Digunakan di:**
- ✅ Dashboard Admin (Notification popup)
- ✅ Manajemen Notifikasi (CRUD)
- ✅ Verifikasi (create notification saat approve/reject)
- ✅ Semua role mendapat notifikasi

**Type notifikasi:**
- `schedule_rejected` - Jadwal ditolak
- `rejection_rejected` - Penolakan ditolak admin
- `schedule_confirmed` - Jadwal disetujui
- `rating_received` - Mendapat rating baru
- dll

---

### **10. TABEL `materi`** 📚

**Primary Key:** `id_materi` (STRING)
**Increment:** FALSE (Format: 'MTR1', 'MTR2', dll)

**Kolom:**
| Kolom | Tipe | Kegunaan |
|-------|------|----------|
| `id_materi` | string(20) | Primary key, auto 'MTR{n}' |
| `modul` | string | Nama modul |
| `topik` | string | Nama topik |
| `sub_topik` | string | Nama sub topik |
| `pertemuan` | integer | Nomor pertemuan |
| `deskripsi` | text | Deskripsi materi |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Digunakan di:**
- ✅ Member: Pilih Materi saat buat jadwal
- ✅ Mentor: Pilih Materi saat konfirmasi
- ✅ Riwayat Pertemuan (resolve pertemuan number)
- ✅ Schedules (foreign key, materi_modul, materi_topik, materi_sub_topik)

---

### **11. TABEL `meeting_history`** 📜

**Primary Key:** `id` (AUTO INCREMENT)

**Kolom:**
| Kolom | Tipe | Kegunaan |
|-------|------|----------|
| `id` | bigint | Primary key |
| `meeting_id` | bigint | FK ke meetings.id |
| `member_id` | string(20) | FK ke users.id_user |
| `mentor_id` | string(20) | FK ke users.id_user |
| `completed_at` | timestamp | Waktu selesai |
| `notes` | text | Catatan pertemuan |
| `rating` | decimal | Rating (1-5) |
| `feedback` | text | Feedback |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Digunakan di:**
- ✅ Riwayat Pertemuan
- ✅ Member: Riwayat Saya
- ✅ Mentor: Riwayat Saya

---

### **12. TABEL `reports`** 📄

**Primary Key:** `id` (AUTO INCREMENT)

**Kolom:**
| Kolom | Tipe | Kegunaan |
|-------|------|----------|
| `id` | bigint | Primary key |
| `user_id` | string(20) | FK ke users.id_user |
| `status` | enum | 'pending', 'approved', 'rejected' |
| `content` | text | Isi laporan |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Digunakan di:**
- ✅ Mentor: Laporan (create/edit)
- ✅ Dashboard Admin (laporan menunggu count)

---

### **13-19. TABEL PENUNJANG**

| Tabel | Kegunaan |
|-------|----------|
| `activity_logs` | Log aktivitas user |
| `sessions` | Session login Laravel |
| `password_reset_tokens` | Reset password |
| `cache` | Laravel cache |
| `jobs` | Laravel queue |
| `mentor_specializations` | Pivot (tidak digunakan) |
| `mentor_available_days` | Pivot (tidak digunakan) |

---

## 🎯 **PENGGUNAAN DATABASE PER FITUR**

### **1. WELCOME PAGE** 🌐

**Tabel Digunakan:**
- ❌ TIDAK ada query database (static content)

**Controller:** Route/View
**Data:** Pure HTML/JSX (no database)

---

### **2. AUTENTIKASI LOGIN** 🔐

**Tabel Digunakan:**
1. **`users`** - Verify credentials
   - Kolom: `email`, `password`, `role`, `status`
   - WHERE: `email = ?` AND `password` (bcrypt)
   - UPDATE: `last_login_at = now()` (optional)

2. **`sessions`** - Store session
   - Laravel automatically

**Controller:** `AuthenticatedSessionController.php`

**Flow:**
```
1. User input email/password
2. Verify di users table
3. Create session
4. Redirect berdasarkan role:
   - admin → /admin/dashboard
   - mentor → /mentor/dashboard
   - member → /member/dashboard
```

---

### **3. DASHBOARD ADMIN** 📊

**Tabel Digunakan:**

1. **`member_profiles`**
   - Count total member
   - Kolom: Semua record

2. **`mentor_profiles`**
   - Count total mentor
   - Kolom: Semua record

3. **`schedules`**
   - Verifikasi mentor count
   - Kolom: `status = 'pending_admin_verification'`

4. **`meetings`**
   - Status pertemuan (chart pie)
   - Kolom: `status` (completed, ongoing, pending, confirmed)
   - Group by: status
   - Count: per status

5. **`users` + `meetings`**
   - Sesi pembelajaran per mentor (chart bar)
   - Filter: `role = 'mentor'`
   - Count: meetings WHERE status = 'completed'
   - Order by: count DESC

6. **`ratings`**
   - Recent reviews (10 terbaru)
   - Kolom: `id_rating`, `rating`, `review`, `created_at`
   - Order by: `created_at DESC`
   - Limit: 10
   - WITH: member, mentor, specialization

7. **`users` + `ratings`**
   - Mentor ratings (ranking)
   - Calculate: AVG(rating), COUNT(rating)
   - Filter: mentors yang punya rating
   - Order by: AVG(rating) DESC

**Controller:** `AdminDashboardController.php`

---

### **4. MANAJEMEN MEMBER** 👤

**Tabel Digunakan:**

1. **`users`**
   - Filter: `role = 'member'`
   - CRUD: name, email, password

2. **`member_profiles`**
   - CRUD: phone, meeting_type, remaining_sessions
   - WITH: specialization

3. **`specializations`**
   - Lookup by name
   - Dapatkan Id_specializations

**Controller:** `MemberController.php`

**Features:**
- List (pagination, search, filter)
- Create (insert users + member_profiles)
- Update
- Delete (CASCADE ke meetings, ratings, schedules, meeting_history)
- Statistics (total, daring, luring)

---

### **5. MANAJEMEN MENTOR** 👨‍🏫

**Tabel Digunakan:**

1. **`users`**
   - Filter: `role = 'mentor'`
   - CRUD: name, email, password

2. **`mentor_profiles`**
   - CRUD: phone
   - JSON fields: `specialization_ids`, `available_day_ids`

3. **`specializations`**
   - Resolve names dari specialization_ids

4. **`available_days`**
   - Resolve names dari available_day_ids

5. **`ratings`**
   - Calculate: AVG(rating), COUNT(rating)
   - Kolom: ratings_avg_rating, ratings_count

6. **`meetings`**
   - Count completed
   - Kolom: completed_meetings_count

**Controller:** `MentorController.php`

**Features:**
- List (pagination, search, filter by specialization & day)
- Create (insert users + mentor_profiles)
- Update
- Delete (CASCADE)
- Statistics (ratings, completed meetings)

---

### **6. VERIFIKASI PENOLAKAN** ✅❌

**Tabel Digunakan:**

1. **`schedules`**
   - List: `status = 'pending_admin_verification'`
   - Kolom: semua kolom schedule
   - WITH: member, mentor

2. **`users`**
   - Via relationship (member, mentor)
   - Kolom: `name`, `email`

3. **`notifications`**
   - INSERT saat approve/reject
   - Kolom: `user_id`, `title`, `message`, `type`, `is_read`

**Controller:** `VerificationController.php`

**Actions:**

**APPROVE:**
```
schedules:
  UPDATE status = 'rejected'

notifications:
  INSERT untuk member
```

**REJECT:**
```
schedules:
  UPDATE status = 'pending_approval'
  UPDATE rejection_reason = null

notifications:
  INSERT untuk mentor
```

---

### **7. RIWAYAT PERTEMUAN** 📜

**Tabel Digunakan:**

1. **`schedules`**
   - Filter: `status = 'completed'`
   - Kolom: semua kolom termasuk materi_modul, materi_topik, materi_sub_topik
   - WITH: member, mentor

2. **`users`**
   - Via relationship (member, mentor names)

3. **`materi`**
   - Resolve pertemuan number
   - WHERE: modul = ? AND topik = ?

**Controller:** `RiwayatPertemuanController.php`

**Features:**
- List completed schedules
- Filter by training type
- Pagination
- Order by: most recent

---

### **8. MANAJEMEN NOTIFIKASI** 🔔

**Tabel Digunakan:**

1. **`notifications`**
   - List (pagination, search, filter)
   - CRUD: create, mark as read, mark all as read
   - Statistics: total, unread, read, today, this week

**Controller:** `NotificationController.php`

**Features:**
- List all notifications
- Search by title/message
- Filter by type
- Filter by read/unread status
- Pagination (20 per page)
- Statistics
- Mark as read (single/all)

**Kolom yang digunakan:**
- `id`, `type`, `title`, `message`, `data`, `is_read`, `read_at`, `user_id`, `created_at`

---

## 🔄 **RELASI UTAMA DALAM SISTEM**

### **USER CORE:**
```
users (PK: id_user)
├── 1:1 → member_profiles (FK: user_id)
│   └── N:1 → specializations (FK: Id_specializations)
├── 1:1 → mentor_profiles (FK: user_id)
│   ├── N:N → specializations (via JSON: specialization_ids)
│   └── N:N → available_days (via JSON: available_day_ids)
├── 1:N → schedules (sebagai member via member_id)
├── 1:N → schedules (sebagai mentor via mentor_id)
├── 1:N → meetings (sebagai member via member_id)
├── 1:N → meetings (sebagai mentor via mentor_id)
├── 1:N → ratings (sebagai member via member_id)
├── 1:N → ratings (sebagai mentor via mentor_id)
├── 1:N → notifications (via user_id)
└── 1:N → activity_logs (via user_id)
```

### **SCHEDULE FLOW:**
```
schedules (PK: Id_schedles)
├── N:1 → users (member via member_id)
├── N:1 → users (mentor via mentor_id)
├── N:1 → specializations (via Id_specializations)
└── N:1 → materi (via materi_id)

Status Flow:
pending → pending_approval → confirmed → completed
       ↓
pending_admin_verification → rejected
```

### **RATING SYSTEM:**
```
ratings (PK: id_rating)
├── N:1 → users (member via member_id)
└── N:1 → users (mentor via mentor_id)

Calculate for dashboard:
- AVG(rating) per mentor
- COUNT(rating) per mentor
```

---

## ✅ **KESIMPULAN**

### **📊 STATISTIK DATABASE:**

- **Total Tabel:** 19
- **Tabel Aktif:** 13 (6 tabel penunjang Laravel)
- **Total Kolom:** ~100+ kolom
- **Foreign Key:** 15+ relationships
- **Auto-generated IDs:** 6 tabel (users, member_profiles, mentor_profiles, schedules, ratings, materi)

### **🎯 TIDAK ADA DATA HARDCODED:**

Semua fitur menggunakan database real:
- ✅ Welcome Page (static, no DB)
- ✅ Login (users, sessions)
- ✅ Dashboard Admin (member_profiles, mentor_profiles, schedules, meetings, ratings, users)
- ✅ Member Management (users, member_profiles, specializations)
- ✅ Mentor Management (users, mentor_profiles, ratings, meetings, specializations, available_days)
- ✅ Verifikasi (schedules, users, notifications)
- ✅ Riwayat (schedules, users, materi)
- ✅ Notifikasi (notifications)

### **🔗 RELASI UTAMA:**

1. **users** → Hub utama semua relasi
2. **member_profiles** → Profil detail member
3. **mentor_profiles** → Profil detail mentor
4. **schedules** → Core jadwal sistem
5. **meetings** → Pertemuan yang terjadi
6. **ratings** → Review & rating
7. **notifications** → Sistem notifikasi
8. **materi** → Materi pembelajaran

**Status:** ✅ **SEMUA DATA REAL DARI DATABASE, TIDAK ADA HARDCODED**


