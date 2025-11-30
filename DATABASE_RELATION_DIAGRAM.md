# 🗺️ Database Relation Diagram - Sistem Manajemen Bimbingan Digital

## 📊 **VISUALISASI RELASI DATABASE**

---

## 🎯 **CORE RELATIONSHIP DIAGRAM**

```
┌──────────────────────────────────────────────────────────────────────┐
│                           TABEL: users ⭐                              │
│                     Primary Key: id_user                              │
│                   (Format: 'U1', 'U2', 'U3')                          │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
         ▼                          ▼                          ▼
    ┌─────────┐              ┌─────────┐              ┌─────────────────┐
    │member_  │              │mentor_  │              │   Other Tables   │
    │profiles │              │profiles │              │  (schedules,     │
    │         │              │         │              │   meetings,       │
    │FK:      │              │FK:      │              │   ratings,       │
    │user_id  │              │user_id  │              │   notifications) │
    └─────────┘              └─────────┘              └─────────────────┘
         │                          │                          │
         ▼                          ▼                          ▼
    ┌─────────┐              ┌──────────────────┐    ┌──────────────────┐
    │speciali-│              │  specializations │    │  available_days  │
    │zations  │              │   (via JSON)      │    │   (via JSON)     │
    │         │              │                  │    │                  │
    │FK:      │              │                  │    │                  │
    │Id_speci-│              │                  │    │                  │
    │alizations│             │                  │    │                  │
    └─────────┘              └──────────────────┘    └──────────────────┘
```

---

## 🔗 **DETAIL RELASI PER FITUR**

### **1️⃣ DASHBOARD ADMIN**

**Tabel yang Digunakan:**
```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│member_profiles │    │mentor_profiles│    │   schedules  │
│COUNT(*)      │    │COUNT(*)      │    │WHERE status= │
└─────────────┘      └──────────────┘    │'pending...'  │
                                        └──────────────┘
         │                   │                   │
         │                   │                   │
         ▼                   ▼                   ▼
    Total Member        Total Mentor    Verifikasi Mentor

┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   meetings  │      │   ratings    │      │    users     │
│GROUP BY     │      │ORDER BY      │      │+ ratings     │
│status       │      │created_at    │      │AVG, COUNT    │
└─────────────┘      └──────────────┘      └──────────────┘
         │                   │                   │
         │                   │                   │
         ▼                   ▼                   ▼
    Status Chart     Recent Reviews      Mentor Ratings
```

**Relasi FK:**
- `member_profiles.user_id` → `users.id_user`
- `mentor_profiles.user_id` → `users.id_user`
- `schedules.member_id` → `users.id_user`
- `meetings.mentor_id` → `users.id_user`
- `ratings.mentor_id` → `users.id_user`
- `ratings.member_id` → `users.id_user` → `member_profiles.user_id` → `specializations.Id_specializations`

---

### **2️⃣ MANAJEMEN MEMBER**

**Relasi Chain:**
```
users (role='member')
  │ 1:1
  ▼
member_profiles
  │ FK: user_id → users.id_user
  │ FK: Id_specializations → specializations.Id_specializations
  ▼
specializations
  └─→ name (training type)
```

**Database CRUD:**
```
CREATE:
  ┌────────┐          ┌──────────────┐
  │ users  │ → INSERT │member_profiles│
  │        │          │              │
  │PK: id  │          │FK: user_id   │
  │        │          │FK: Id_spec.. │
  └────────┘          └──────────────┘
         │                    │
         │                    ▼
         │            ┌──────────────┐
         └───────────→│specializations│
                      │              │
                      │PK: Id_speci..│
                      └──────────────┘

READ:
  ┌────────┐
  │ users  │
  │ JOIN   │
  │member_ │
  │profiles│
  │ JOIN   │
  │speciali│
  │zations │
  └────────┘

UPDATE/DELETE:
  CASCADE dari users → member_profiles
```

**Kolom yang Digunakan:**
- `users`: id_user, name, email, password, role
- `member_profiles`: Id_member, user_id, phone, meeting_type, remaining_sessions, Id_specializations
- `specializations`: Id_specializations, name

---

### **3️⃣ MANAJEMEN MENTOR**

**Relasi Chain:**
```
users (role='mentor')
  │ 1:1
  ▼
mentor_profiles
  │ FK: user_id → users.id_user
  │ JSON: specialization_ids[] → specializations
  │ JSON: available_day_ids[] → available_days
  │
  ├─────→ ratings (AVG, COUNT)
  │      FK: ratings.mentor_id → users.id_user
  │
  └─────→ meetings (COUNT completed)
          FK: meetings.mentor_id → users.id_user
```

**Database Query:**
```sql
-- List Mentor dengan Stats
SELECT 
    users.id_user,
    users.name,
    mentor_profiles.phone,
    mentor_profiles.specialization_ids,  -- JSON
    mentor_profiles.available_day_ids,   -- JSON
    COUNT(ratings.id_rating) as ratings_count,
    AVG(ratings.rating) as avg_rating,
    COUNT(meetings.id) as completed_meetings
FROM users
LEFT JOIN mentor_profiles ON users.id_user = mentor_profiles.user_id
LEFT JOIN ratings ON users.id_user = ratings.mentor_id
LEFT JOIN meetings ON users.id_user = meetings.mentor_id AND meetings.status='completed'
WHERE users.role = 'mentor'
GROUP BY users.id_user
```

**Kolom yang Digunakan:**
- `users`: id_user, name, email
- `mentor_profiles`: Id_mentor, user_id, phone, specialization_ids (JSON), available_day_ids (JSON)
- `ratings`: id_rating, mentor_id, rating, review
- `meetings`: id, mentor_id, status

---

### **4️⃣ VERIFIKASI PENOLAKAN**

**Flow Diagram:**
```
┌─────────────────────────────────────────────────────────────┐
│  schedules (status='pending_admin_verification')            │
│  PK: Id_schedles                                            │
│  FK: member_id, mentor_id                                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  JOIN users (get names)         │
        │  - schedules.member_id → users  │
        │  - schedules.mentor_id → users  │
        └─────────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
    Admin APPROVE                Admin REJECT
            │                           │
            ▼                           ▼
    UPDATE status='rejected'    UPDATE status='pending_approval'
            │                           │
            ▼                           ▼
    ┌───────────────────┐      ┌───────────────────┐
    │ INSERT INTO       │      │ INSERT INTO       │
    │ notifications     │      │ notifications     │
    │ user_id=member_id │      │ user_id=mentor_id │
    │ type='rejected'   │      │ type='rejection_..'│
    └───────────────────┘      └───────────────────┘
```

**Relasi FK:**
- `schedules.member_id` → `users.id_user`
- `schedules.mentor_id` → `users.id_user`
- `notifications.user_id` → `users.id_user`

---

### **5️⃣ RIWAYAT PERTEMUAN**

**Relasi Chain:**
```
schedules (status='completed')
  │ PK: Id_schedles
  │ FK: member_id, mentor_id, materi_id
  │
  ├──→ users (member: schedules.member_id → users.id_user → name)
  │
  ├──→ users (mentor: schedules.mentor_id → users.id_user → name)
  │
  └──→ materi (resolve pertemuan number)
       WHERE materi.modul = schedules.materi_modul
       AND materi.topik = schedules.materi_topik
       SELECT materi.pertemuan
```

**Query Pattern:**
```sql
SELECT 
    schedules.*,
    member.name as member_name,
    mentor.name as mentor_name,
    materi.pertemuan
FROM schedules
JOIN users as member ON schedules.member_id = member.id_user
JOIN users as mentor ON schedules.mentor_id = mentor.id_user
LEFT JOIN materi ON (
    materi.modul = schedules.materi_modul 
    AND materi.topik = schedules.materi_topik
)
WHERE schedules.status = 'completed'
```

**Relasi FK:**
- `schedules.member_id` → `users.id_user`
- `schedules.mentor_id` → `users.id_user`
- `schedules.materi_id` → `materi.id_materi`

---

### **6️⃣ MANAJEMEN NOTIFIKASI**

**Relasi Simple:**
```
notifications
  │ PK: id
  │ FK: user_id
  │
  └──→ users (notifications.user_id → users.id_user)
```

**Query Pattern:**
```sql
-- Get notifications for user
SELECT * FROM notifications 
WHERE user_id = 'U5' 
ORDER BY created_at DESC;

-- Get unread count
SELECT COUNT(*) FROM notifications 
WHERE user_id = 'U5' AND is_read = false;

-- Mark as read
UPDATE notifications 
SET is_read = true, read_at = NOW()
WHERE id = ?;
```

**Relasi FK:**
- `notifications.user_id` → `users.id_user`

---

## 📋 **SEMUA FOREIGN KEYS**

| Parent Table | Child Table | FK Column | PK Column | ON DELETE |
|--------------|-------------|-----------|-----------|-----------|
| users | member_profiles | user_id | id_user | CASCADE |
| users | mentor_profiles | user_id | id_user | CASCADE |
| users | schedules (as member) | member_id | id_user | CASCADE |
| users | schedules (as mentor) | mentor_id | id_user | CASCADE |
| users | meetings (as member) | member_id | id_user | CASCADE |
| users | meetings (as mentor) | mentor_id | id_user | CASCADE |
| users | ratings (as mentor) | mentor_id | id_user | CASCADE |
| users | ratings (as member) | member_id | id_user | CASCADE |
| users | notifications | user_id | id_user | CASCADE |
| specializations | member_profiles | Id_specializations | Id_specializations | RESTRICT |
| specializations | schedules | Id_specializations | Id_specializations | RESTRICT |
| materi | schedules | materi_id | id_materi | RESTRICT |

---

## ✅ **KESIMPULAN**

### **Total Foreign Keys:** 12

### **User-Centric:**
- Semua tabel (kecuali `materi`, `specializations`, `available_days`) memiliki relasi ke `users`
- CASCADE DELETE: Jika user dihapus, semua data terkait dihapus

### **Core Tables:**
- `users` → Hub utama
- `schedules` → Core jadwal
- `meetings` → Pertemuan
- `ratings` → Review
- `notifications` → Notifikasi

### **JSON Fields:**
- `mentor_profiles.specialization_ids` → Array of Id
- `mentor_profiles.available_day_ids` → Array of Id

**Status:** ✅ **SEMUA RELASI LENGKAP DAN BENAR**
















