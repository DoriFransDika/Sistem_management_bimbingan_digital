# 📊 Database Schema Lengkap - Sistem Manajemen Bimbingan Digital

## 🎯 **RINGKASAN**

Dokumen ini menjelaskan **schema database lengkap**, **relasi PK/FK**, dan **mapping per halaman** untuk semua fitur yang telah dibahas.

---

## 📋 **DAFTAR SEMUA TABEL DATABASE**

| No | Nama Tabel | Primary Key | Foreign Keys | Deskripsi |
|----|------------|-------------|--------------|-----------|
| 1 | `users` | `id_user` | - | User utama (admin, mentor, member) |
| 2 | `member_profiles` | `Id_member` | `user_id`→users, `Id_specializations`→specializations | Profil member |
| 3 | `mentor_profiles` | `Id_mentor` | `user_id`→users | Profil mentor |
| 4 | `specializations` | `Id_specializations` | - | Jenis pelatihan |
| 5 | `available_days` | `Id_day` | - | Hari tersedia |
| 6 | `schedules` | `Id_schedles` | `member_id`→users, `mentor_id`→users, `Id_specializations`→specializations, `materi_id`→materi | Jadwal pertemuan |
| 7 | `meetings` | `id` (auto) | `member_id`→users, `mentor_id`→users | Pertemuan yang disetujui |
| 8 | `meeting_history` | `id` (auto) | `member_id`→users, `mentor_id`→users | Riwayat pertemuan |
| 9 | `ratings` | `id_rating` | `mentor_id`→users, `member_id`→users | Rating & review |
| 10 | `notifications` | `id` (auto) | `user_id`→users | Notifikasi |
| 11 | `materi` | `id_materi` | - | Materi pembelajaran |
| 12 | `reports` | `id` (auto) | `user_id`→users | Laporan |
| 13 | `activity_logs` | `id` (auto) | `user_id`→users | Log aktivitas |

---

## 🔗 **RELASI ANTAR TABEL (SKEMA ERD)**

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CORE TABLE: users                              │
│  Primary Key: id_user (STRING, format: 'U1', 'U2', dll)                │
└────────────────────────────────────────────────────────────────────────┘
                           │
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐        ┌─────────┐      ┌─────────┐
   │ member_ │        │ mentor_ │      │  Other  │
   │profiles │        │profiles │      │ Tables  │
   └─────────┘        └─────────┘      └─────────┘
        │                  │
        │                  │
        ▼                  ▼
   ┌──────────┐      ┌────────────────────┐
   │specializa│      │specializations &   │
   │    tions│      │available_days (JSON)│
   └──────────┘      └────────────────────┘
```

---

## 📊 **DETAIL SETIAP TABEL DENGAN RELASI**

### **1. TABEL `users`** ⭐ CORE TABLE

```sql
CREATE TABLE users (
    id_user VARCHAR(20) PRIMARY KEY,  -- Format: 'U1', 'U2'
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'mentor', 'member') DEFAULT 'member',
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Foreign Keys:**
- ❌ Tidak ada (Root table)

**Relasi HAS MANY:**
- → `member_profiles` (1:1 via user_id)
- → `mentor_profiles` (1:1 via user_id)
- → `schedules` (1:N as member via member_id)
- → `schedules` (1:N as mentor via mentor_id)
- → `meetings` (1:N as member via member_id)
- → `meetings` (1:N as mentor via mentor_id)
- → `ratings` (1:N as member via member_id)
- → `ratings` (1:N as mentor via mentor_id)
- → `notifications` (1:N via user_id)
- → `activity_logs` (1:N via user_id)

---

### **2. TABEL `member_profiles`**

```sql
CREATE TABLE member_profiles (
    Id_member VARCHAR(20) PRIMARY KEY,  -- Format: 'MB1', 'MB2'
    user_id VARCHAR(20) NOT NULL,        -- FK → users.id_user
    phone VARCHAR(20),
    meeting_type VARCHAR(10),           -- 'Daring' atau 'Luring'
    Id_specializations VARCHAR(20),     -- FK → specializations.Id_specializations
    remaining_sessions INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
);
```

**Foreign Keys:**
- `user_id` → `users.id_user`
- `Id_specializations` → `specializations.Id_specializations`

**Relasi BELONGS TO:**
- ← `users` (N:1 via user_id)
- ← `specializations` (N:1 via Id_specializations)

---

### **3. TABEL `mentor_profiles`**

```sql
CREATE TABLE mentor_profiles (
    Id_mentor VARCHAR(20) PRIMARY KEY,  -- Format: 'MT1', 'MT2'
    user_id VARCHAR(20) NOT NULL,        -- FK → users.id_user
    phone VARCHAR(20),
    specialization_ids JSON,            -- Array of Id_specializations
    available_day_ids JSON,             -- Array of Id_day
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
);
```

**Foreign Keys:**
- `user_id` → `users.id_user`

**Relasi BELONGS TO:**
- ← `users` (N:1 via user_id)

**JSON Fields:**
- `specialization_ids` → Array of `specializations.Id_specializations`
- `available_day_ids` → Array of `available_days.Id_day`

---

### **4. TABEL `specializations`**

```sql
CREATE TABLE specializations (
    Id_specializations VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,         -- 'Web Programming Basic', dll
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Foreign Keys:**
- ❌ Tidak ada (Reference table)

**Relasi:**
- → `member_profiles` (1:N via Id_specializations)
- → `mentor_profiles` (N:N via JSON specialization_ids)

---

### **5. TABEL `available_days`**

```sql
CREATE TABLE available_days (
    Id_day VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,          -- 'Senin', 'Selasa', dll
    sort_order INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Foreign Keys:**
- ❌ Tidak ada (Reference table)

**Relasi:**
- → `mentor_profiles` (N:N via JSON available_day_ids)

---

### **6. TABEL `schedules`** 📆⭐ VERY IMPORTANT

```sql
CREATE TABLE schedules (
    Id_schedles VARCHAR(20) PRIMARY KEY,  -- Format: 'SC1', 'SC2'
    member_id VARCHAR(20) NOT NULL,       -- FK → users.id_user
    mentor_id VARCHAR(20) NOT NULL,       -- FK → users.id_user
    Id_specializations VARCHAR(20),       -- FK → specializations
    materi_id VARCHAR(20),                 -- FK → materi.id_materi
    training_type ENUM('Daring', 'Luring'),
    proposed_date DATE,
    proposed_time TIME,
    status ENUM('pending', 'pending_approval', 'pending_admin_verification', 
                'confirmed', 'rejected', 'completed', 'cancelled'),
    rejection_reason TEXT,
    materi_modul VARCHAR(255),
    materi_topik VARCHAR(255),
    materi_sub_topik VARCHAR(255),
    dokumentasi VARCHAR(255),
    laporan_dikirim_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (Id_specializations) REFERENCES specializations(Id_specializations),
    FOREIGN KEY (materi_id) REFERENCES materi(id_materi)
);
```

**Foreign Keys:**
- `member_id` → `users.id_user`
- `mentor_id` → `users.id_user`
- `Id_specializations` → `specializations.Id_specializations`
- `materi_id` → `materi.id_materi`

**Relasi:**
- ← `users` (member: N:1 via member_id)
- ← `users` (mentor: N:1 via mentor_id)
- ← `specializations` (N:1 via Id_specializations)
- ← `materi` (N:1 via materi_id)

---

### **7. TABEL `meetings`**

```sql
CREATE TABLE meetings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(20) NOT NULL,      -- FK → users.id_user
    mentor_id VARCHAR(20) NOT NULL,      -- FK → users.id_user
    schedule DATETIME,
    status ENUM('pending', 'confirmed', 'ongoing', 'completed', 'cancelled'),
    topic VARCHAR(255),
    notes TEXT,
    feedback TEXT,
    rating DECIMAL(3,1),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES users(id_user) ON DELETE CASCADE
);
```

**Foreign Keys:**
- `member_id` → `users.id_user`
- `mentor_id` → `users.id_user`

---

### **8. TABEL `ratings`**

```sql
CREATE TABLE ratings (
    id_rating VARCHAR(20) PRIMARY KEY,   -- Format: 'RT1', 'RT2'
    mentor_id VARCHAR(20) NOT NULL,     -- FK → users.id_user
    member_id VARCHAR(20) NOT NULL,     -- FK → users.id_user
    rating DECIMAL(2,1) NOT NULL,       -- 1.0 - 5.0
    review TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (mentor_id) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users(id_user) ON DELETE CASCADE
);
```

**Foreign Keys:**
- `mentor_id` → `users.id_user`
- `member_id` → `users.id_user`

---

### **9. TABEL `notifications`**

```sql
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20),                -- FK → users.id_user
    type VARCHAR(50) NOT NULL,          -- schedule_confirmed, dll
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,                          -- Additional data
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
);
```

**Foreign Keys:**
- `user_id` → `users.id_user`

---

### **10. TABEL `materi`**

```sql
CREATE TABLE materi (
    id_materi VARCHAR(20) PRIMARY KEY,  -- Format: 'MTR1'
    modul VARCHAR(255),
    topik VARCHAR(255),
    sub_topik VARCHAR(255),
    pertemuan INT,
    deskripsi TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Foreign Keys:**
- ❌ Tidak ada (Reference table)

**Relasi:**
- → `schedules` (1:N via materi_id)

---

## 🎯 **MAPPING PER HALAMAN DAN FITUR**

### **HALAMAN 1: WELCOME PAGE 🌐**

**Database yang Digunakan:**
- ❌ **TIDAK ADA** (Static content, no database)

**Relasi:**
- Tidak ada

---

### **HALAMAN 2: AUTENTIKASI LOGIN 🔐**

**Database yang Digunakan:**
- ✅ `users`
  - Kolom: `email`, `password`, `role`, `status`
  - Query: `SELECT * FROM users WHERE email = ? AND password = ?`
  - Update: `UPDATE users SET last_login_at = ? WHERE id_user = ?`

**Relasi:**
```
users ← Query by email & password
       UPDATE last_login_at
```

**Tabel Terkait:**
- `users` (PK: id_user)

---

### **HALAMAN 3: DASHBOARD ADMIN 📊**

**Database yang Digunakan:**
1. ✅ **`member_profiles`** - Total Member
   - Query: `SELECT COUNT(*) FROM member_profiles`
   
2. ✅ **`mentor_profiles`** - Total Mentor
   - Query: `SELECT COUNT(*) FROM mentor_profiles`
   
3. ✅ **`schedules`** - Verifikasi Mentor
   - Query: `SELECT COUNT(*) FROM schedules WHERE status = 'pending_admin_verification'`
   
4. ✅ **`meetings`** - Status Pertemuan (Chart)
   - Query: `SELECT status, COUNT(*) FROM meetings GROUP BY status`
   
5. ✅ **`users` + `meetings`** - Sesi per Mentor
   - Query: Mentor dengan COUNT meetings WHERE status='completed'
   - Relasi: `users.id_user` ← `meetings.mentor_id`
   
6. ✅ **`ratings`** - Recent Reviews
   - Query: `SELECT * FROM ratings ORDER BY created_at DESC LIMIT 10`
   - Relasi: `ratings.member_id` → `users.id_user`
   - Relasi: `ratings.mentor_id` → `users.id_user`
   - Relasi: `users.id_user` → `member_profiles.user_id` → `specializations.Id_specializations`
   
7. ✅ **`users` + `ratings`** - Mentor Ratings
   - Query: AVG(rating), COUNT(rating) per mentor
   - Relasi: `users.id_user` ← `ratings.mentor_id`

**Relasi Diagram:**
```
member_profiles → COUNT
mentor_profiles → COUNT
schedules → WHERE status='pending_admin_verification' → COUNT
meetings → GROUP BY status → COUNT
  ↓
meetings.mentor_id → users.id_user → name
ratings → ORDER BY created_at DESC LIMIT 10
  ↓
ratings.member_id → users → member_profiles → specializations → name
ratings.mentor_id → users → name
users + ratings → AVG, COUNT per mentor
```

**Tabel Terkait:**
- `member_profiles` (PK: Id_member)
- `mentor_profiles` (PK: Id_mentor)
- `schedules` (PK: Id_schedles)
- `meetings` (PK: id)
- `ratings` (PK: id_rating)
- `users` (PK: id_user) - via relasi
- `specializations` (PK: Id_specializations) - via relasi
- `member_profiles` (PK: Id_member) - via relasi

---

### **HALAMAN 4: MANAJEMEN MEMBER 👤**

**Database yang Digunakan:**
1. ✅ **`users`** - List Member
   - Query: `SELECT * FROM users WHERE role = 'member'`
   - CRUD: name, email, password
   
2. ✅ **`member_profiles`** - Detail Member
   - Query: Join dengan users
   - CRUD: phone, meeting_type, remaining_sessions
   - Relasi: `member_profiles.user_id` → `users.id_user`
   
3. ✅ **`specializations`** - Training Type
   - Query: Lookup name
   - Relasi: `member_profiles.Id_specializations` → `specializations.Id_specializations`

**Relasi Diagram:**
```
users (role='member') 
  ↓ 1:1
member_profiles.user_id
  ↓ N:1
specializations.Id_specializations

CRUD Operations:
- CREATE: INSERT users + INSERT member_profiles
- READ: SELECT users JOIN member_profiles JOIN specializations
- UPDATE: UPDATE users + UPDATE member_profiles
- DELETE: CASCADE DELETE dari users
```

**Tabel Terkait:**
- `users` (PK: id_user)
- `member_profiles` (PK: Id_member, FK: user_id, Id_specializations)
- `specializations` (PK: Id_specializations)

---

### **HALAMAN 5: MANAJEMEN MENTOR 👨‍🏫**

**Database yang Digunakan:**
1. ✅ **`users`** - List Mentor
   - Query: `SELECT * FROM users WHERE role = 'mentor'`
   
2. ✅ **`mentor_profiles`** - Detail Mentor
   - Relasi: `mentor_profiles.user_id` → `users.id_user`
   
3. ✅ **`specializations`** - Via JSON
   - Query: Resolve dari JSON `specialization_ids`
   - Relasi: JSON array contains Id_specializations
   
4. ✅ **`available_days`** - Via JSON
   - Query: Resolve dari JSON `available_day_ids`
   - Relasi: JSON array contains Id_day
   
5. ✅ **`ratings`** - Calculate AVG & COUNT
   - Query: `SELECT AVG(rating), COUNT(*) FROM ratings WHERE mentor_id = ?`
   - Relasi: `ratings.mentor_id` → `users.id_user`
   
6. ✅ **`meetings`** - Count Completed
   - Query: `SELECT COUNT(*) FROM meetings WHERE mentor_id = ? AND status = 'completed'`
   - Relasi: `meetings.mentor_id` → `users.id_user`

**Relasi Diagram:**
```
users (role='mentor')
  ↓ 1:1
mentor_profiles.user_id
  ↓ JSON
specializations (specialization_ids JSON)
available_days (available_day_ids JSON)
  ↓
ratings.mentor_id → users.id_user → AVG, COUNT
meetings.mentor_id → users.id_user → COUNT
```

**Tabel Terkait:**
- `users` (PK: id_user)
- `mentor_profiles` (PK: Id_mentor, FK: user_id)
- `specializations` (PK: Id_specializations) - via JSON
- `available_days` (PK: Id_day) - via JSON
- `ratings` (PK: id_rating, FK: mentor_id)
- `meetings` (PK: id, FK: mentor_id)

---

### **HALAMAN 6: VERIFIKASI PENOLAKAN ✅**

**Database yang Digunakan:**
1. ✅ **`schedules`** - List Pending
   - Query: `SELECT * FROM schedules WHERE status = 'pending_admin_verification'`
   - Update: status = 'rejected' atau 'pending_approval'
   
2. ✅ **`users`** - Via Relasi
   - Relasi: `schedules.member_id` → `users.id_user` (as member)
   - Relasi: `schedules.mentor_id` → `users.id_user` (as mentor)
   
3. ✅ **`notifications`** - INSERT
   - Query: `INSERT INTO notifications (user_id, type, title, message, ...)`
   - Relasi: `notifications.user_id` → `users.id_user`

**Relasi Diagram:**
```
schedules (status='pending_admin_verification')
  ↓ JOIN
users (member: schedules.member_id → users.id_user)
users (mentor: schedules.mentor_id → users.id_user)
  ↓
ACTION: UPDATE schedules.status
  ↓
INSERT INTO notifications (user_id=member_id/mentor_id)
```

**Tabel Terkait:**
- `schedules` (PK: Id_schedles, FK: member_id, mentor_id)
- `users` (PK: id_user) - via relasi
- `notifications` (PK: id, FK: user_id)

---

### **HALAMAN 7: RIWAYAT PERTEMUAN 📜**

**Database yang Digunakan:**
1. ✅ **`schedules`** - Completed
   - Query: `SELECT * FROM schedules WHERE status = 'completed'`
   - Kolom: materi_modul, materi_topik, materi_sub_topik
   
2. ✅ **`users`** - Via Relasi
   - Relasi: `schedules.member_id` → `users.id_user` (name)
   - Relasi: `schedules.mentor_id` → `users.id_user` (name)
   
3. ✅ **`materi`** - Resolve Pertemuan
   - Query: `SELECT * FROM materi WHERE modul = ? AND topik = ?`
   - Relasi: `schedules.materi_id` → `materi.id_materi`

**Relasi Diagram:**
```
schedules (status='completed')
  ↓ JOIN
users (member: schedules.member_id → users.id_user → name)
users (mentor: schedules.mentor_id → users.id_user → name)
materi (schedules.materi_modul = materi.modul 
        AND schedules.materi_topik = materi.topik → pertemuan)
```

**Tabel Terkait:**
- `schedules` (PK: Id_schedles, FK: member_id, mentor_id, materi_id)
- `users` (PK: id_user) - via relasi
- `materi` (PK: id_materi)

---

### **HALAMAN 8: MANAJEMEN NOTIFIKASI 🔔**

**Database yang Digunakan:**
1. ✅ **`notifications`** - CRUD
   - Query: `SELECT * FROM notifications ORDER BY created_at DESC`
   - Filter: `WHERE type = ?` atau `WHERE is_read = ?`
   - Update: `UPDATE notifications SET is_read = true, read_at = ? WHERE id = ?`
   - Relasi: `notifications.user_id` → `users.id_user`

**Relasi Diagram:**
```
notifications
  ↓
users (notifications.user_id → users.id_user)
```

**Tabel Terkait:**
- `notifications` (PK: id, FK: user_id)
- `users` (PK: id_user) - via relasi

---

## 📊 **RELASI PK/FK LENGKAP**

### **Foreign Keys Summary:**

| Child Table | FK Column | Parent Table | PK Column | ON DELETE |
|-------------|-----------|--------------|-----------|-----------|
| member_profiles | user_id | users | id_user | CASCADE |
| member_profiles | Id_specializations | specializations | Id_specializations | RESTRICT |
| mentor_profiles | user_id | users | id_user | CASCADE |
| schedules | member_id | users | id_user | CASCADE |
| schedules | mentor_id | users | id_user | CASCADE |
| schedules | Id_specializations | specializations | Id_specializations | RESTRICT |
| schedules | materi_id | materi | id_materi | RESTRICT |
| meetings | member_id | users | id_user | CASCADE |
| meetings | mentor_id | users | id_user | CASCADE |
| meetings | schedule_id | schedules | Id_schedles | CASCADE |
| ratings | mentor_id | users | id_user | CASCADE |
| ratings | member_id | users | id_user | CASCADE |
| notifications | user_id | users | id_user | CASCADE |
| reports | user_id | users | id_user | CASCADE |
| activity_logs | user_id | users | id_user | CASCADE |

---

## 🎯 **KESIMPULAN**

### **Total Tabel:** 13 (aktif)

### **Relasi Utama:**
- `users` → Hub pusat semua relasi
- `schedules` → Core jadwal sistem
- `meetings` → Pertemuan yang terjadi
- `ratings` → Review & rating
- `notifications` → Sistem notifikasi

### **Mapping Per Halaman:**

| Halaman | Tabel Database | Relasi |
|---------|---------------|--------|
| Welcome | ❌ Tidak ada | - |
| Login | `users` | Query langsung |
| Dashboard Admin | 7 tabel | users ← member_profiles, mentor_profiles, schedules, meetings, ratings |
| Manajemen Member | 3 tabel | users 1:1 member_profiles N:1 specializations |
| Manajemen Mentor | 6 tabel | users 1:1 mentor_profiles, ratings, meetings |
| Verifikasi | 3 tabel | schedules → users → notifications |
| Riwayat | 3 tabel | schedules → users, materi |
| Notifikasi | 2 tabel | notifications → users |

**Status:** ✅ **SEMUA DATA REAL DARI DATABASE, TIDAK ADA HARDCODED**
















