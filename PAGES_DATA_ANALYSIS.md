# Analisis Data Halaman Admin - Database Tables dan Kolom

## 📋 **Ringkasan: SEMUA DATA DIAMBIL DARI DATABASE**

Setelah analisis mendalam terhadap controller untuk Member Management, Mentor Management, dan Riwayat Pertemuan, berikut adalah rincian lengkap:

---

## 🟦 **HALAMAN 1: MANAJEMEN MEMBER**

### **Controller:** `app/Http/Controllers/Admin/MemberController.php`

### ✅ **1. Get Members (List Members)**

**Kode:**
```php
$query = User::where('role', 'member')->with(['memberProfile.specialization']);
```

**Database Tables Yang Digunakan:**
1. **`users`** (Primary Table)
   - Kolom: `id_user`, `name`, `email`, `created_at`
   - Filter: `role = 'member'`

2. **`member_profiles`** (Via relationship)
   - Kolom: `phone`, `meeting_type`, `remaining_sessions`, `Id_specializations`
   - Relationship: `user_id` → `users.id_user`

3. **`specializations`** (Via relationship)
   - Kolom: `name` (nama training type)
   - Relationship: `Id_specializations` → `specializations.Id_specializations`

**Features:**
- ✅ Search: `name`, `email`, `phone` (dari member profile)
- ✅ Filter by training type: berdasarkan `specialization.name`
- ✅ Filter by meeting type: dari `memberProfile.meeting_type` ('Daring' atau 'Luring')
- ✅ Pagination: 6 items per page
- ✅ Order by: `created_at DESC`

**Kolom yang Dikirim ke Frontend:**
```php
[
    'id' => $user->id_user,
    'name' => $user->name,
    'email' => $user->email,
    'phone' => $user->memberProfile->phone,
    'meetingType' => $user->memberProfile->meeting_type,
    'remainingSessions' => $user->memberProfile->remaining_sessions,
    'trainingType' => $user->memberProfile->specialization->name,
]
```

---

### ✅ **2. Store Member (Tambah Member Baru)**

**Database Operations:**
1. **Insert ke `users`**
   - Kolom: `name`, `email`, `password` (hashed), `role = 'member'`
   - Primary Key: `id_user` (auto-generated format 'U{n}')

2. **Insert/Update ke `member_profiles`**
   - Kolom: `phone`, `meeting_type`, `remaining_sessions`, `Id_specializations`
   - Foreign Key: `user_id` → `users.id_user`

**Kolom Input Required:**
- `name` (users.name)
- `email` (users.email)
- `password` (users.password) - hashed
- `phone` (member_profiles.phone)
- `sessions` (member_profiles.remaining_sessions)
- `meetingType` (member_profiles.meeting_type) - 'Daring' atau 'Luring'
- `trainingType` (specializations.name) - dicari berdasarkan name

---

### ✅ **3. Update Member**

**Database Operations:**
1. **Update `users`**
   - Kolom: `name`, `email`

2. **Update `member_profiles`**
   - Kolom: `phone`, `meeting_type`, `remaining_sessions`, `Id_specializations`

**Kolom yang Bisa Diupdate:**
- Semua kolom seperti Store Member

---

### ✅ **4. Show Member (Detail Member)**

**Database Tables:**
- `users` (WHERE id_user = $id AND role = 'member')
- `member_profiles` (via relationship)
- `specializations` (via relationship)

**Kolom yang Dikirim:**
```php
[
    'id' => $member->id_user,
    'name' => $member->name,
    'email' => $member->email,
    'phone' => $member->memberProfile->phone,
    'meetingType' => $member->memberProfile->meeting_type,
    'remainingSessions' => $member->memberProfile->remaining_sessions,
    'trainingType' => $member->memberProfile->specialization->name,
    'created_at' => $member->created_at,
    'updated_at' => $member->updated_at,
]
```

---

### ✅ **5. Delete Member**

**Database Operations (CASCADE DELETE):**
1. Delete dari `member_profiles` WHERE user_id
2. Delete dari `meetings` WHERE member_id OR mentor_id
3. Delete dari `ratings` WHERE member_id OR mentor_id
4. Delete dari `schedules` WHERE member_id OR mentor_id
5. Delete dari `meeting_history` WHERE member_id OR mentor_id
6. Delete dari `users` (user itu sendiri)

**Semua data terkait dihapus secara transaksional**

---

### ✅ **6. Get Stats (Statistics)**

**Database Tables:**
1. **`users`** - Count total members
   ```php
   User::where('role', 'member')->count()
   ```

2. **`users` + `member_profiles`** - Count by meeting type
   ```php
   // Daring
   User::where('role', 'member')
       ->whereHas('memberProfile', function($query) {
           $query->where('meeting_type', 'Daring');
       })
       ->count()
   
   // Luring
   User::where('role', 'member')
       ->whereHas('memberProfile', function($query) {
           $query->where('meeting_type', 'Luring');
       })
       ->count()
   ```

**Stats Yang Dikirim:**
```json
{
    "total": 10,
    "daring": 6,
    "luring": 4
}
```

---

## 🟩 **HALAMAN 2: MANAJEMEN MENTOR**

### **Controller:** `app/Http/Controllers/Admin/MentorController.php`

### ✅ **1. Get Mentors (List Mentors)**

**Kode:**
```php
$query = User::where('role', 'mentor')
    ->with(['mentorProfile'])
    ->withCount('ratings')
    ->withAvg('ratings', 'rating')
    ->withCount(['meetings as completed_meetings_count' => function ($query) {
        $query->where('status', 'completed');
    }]);
```

**Database Tables Yang Digunakan:**
1. **`users`** (Primary Table)
   - Kolom: `id_user`, `name`, `email`, `created_at`
   - Filter: `role = 'mentor'`

2. **`mentor_profiles`** (Via relationship)
   - Kolom: `phone`, `specialization_ids` (JSON array), `available_day_ids` (JSON array)
   - Relationship: `user_id` → `users.id_user`

3. **`ratings`** (Via relationship - untuk perhitungan)
   - Kolom: `rating` (untuk rata-rata), COUNT untuk jumlah rating
   - Relationship: `mentor_id` → `users.id_user`

4. **`meetings`** (Via relationship - untuk perhitungan)
   - Kolom: `status` (filter completed)
   - Count: jumlah meeting dengan status 'completed'
   - Relationship: `mentor_id` → `users.id_user`

5. **`specializations`** (Untuk resolve specialization_ids)
   - Diakses via method `getSpecializationNames()` pada MentorProfile model

6. **`available_days`** (Untuk resolve available_day_ids)
   - Diakses via method `getAvailableDayNames()` pada MentorProfile model

**Features:**
- ✅ Search: `name`, `email`, `phone` (dari mentor profile)
- ✅ Filter by specialization: berdasarkan `specialization_ids` (JSON contains)
- ✅ Filter by available day: berdasarkan `available_day_ids` (JSON contains)
- ✅ Pagination: 6 items per page
- ✅ Order by: `created_at DESC`

**Kolom yang Dikirim ke Frontend:**
```php
[
    'id' => $user->id_user,
    'name' => $user->name,
    'email' => $user->email,
    'phone' => $user->mentorProfile->phone,
    'specializations' => $user->mentorProfile->getSpecializationNames(), // Array of names
    'available_days' => $user->mentorProfile->getAvailableDayNames(), // Array of names
    'average_rating' => round($user->ratings_avg_rating ?? 0, 1), // FROM ratings table
    'ratings_count' => $user->ratings_count, // FROM ratings table
    'completed_meetings_count' => $user->completed_meetings_count, // FROM meetings table
]
```

---

### ✅ **2. Store Mentor (Tambah Mentor Baru)**

**Database Operations:**
1. **Insert ke `users`**
   - Kolom: `name`, `email`, `password` (hashed), `role = 'mentor'`, `status = 'active'`
   - Primary Key: `id_user` (auto-generated format 'U{n}')

2. **Insert/Update ke `mentor_profiles`**
   - Kolom: `phone`, `specialization_ids` (JSON array), `available_day_ids` (JSON array)
   - Foreign Key: `user_id` → `users.id_user`

**Kolom Input Required:**
- `name` (users.name)
- `email` (users.email)
- `password` (users.password) - hashed
- `phone` (mentor_profiles.phone)
- `specialization_ids` (mentor_profiles.specialization_ids) - Array of IDs (JSON)
- `day_ids` (mentor_profiles.available_day_ids) - Array of IDs (JSON)

---

### ✅ **3. Update Mentor**

**Database Operations:**
1. **Update `users`**
   - Kolom: `name`, `email` (password optional)

2. **Update `mentor_profiles`**
   - Kolom: `phone`, `specialization_ids`, `available_day_ids`

---

### ✅ **4. Show Mentor (Detail Mentor)**

**Database Tables:**
- `users` (WHERE id_user = $id AND role = 'mentor')
- `mentor_profiles` (via relationship)

**Kolom yang Dikirim:**
```php
[
    'id' => $mentor->id_user,
    'name' => $mentor->name,
    'email' => $mentor->email,
    'phone' => $mentor->mentorProfile->phone,
    'specializations' => $mentor->mentorProfile->getSpecializationNames(),
    'available_days' => $mentor->mentorProfile->getAvailableDayNames(),
    'specialization_ids' => $mentor->mentorProfile->specialization_ids,
    'day_ids' => $mentor->mentorProfile->available_day_ids,
    'created_at' => $mentor->created_at,
    'updated_at' => $mentor->updated_at,
]
```

---

### ✅ **5. Delete Mentor**

**Database Operations (CASCADE DELETE):**
1. Delete dari `mentor_profiles` WHERE user_id
2. Delete dari `meetings` WHERE mentor_id OR member_id
3. Delete dari `ratings` WHERE mentor_id OR member_id
4. Delete dari `schedules` WHERE mentor_id OR member_id
5. Delete dari `meeting_history` WHERE mentor_id OR member_id
6. Delete dari `users` (user itu sendiri)

---

### ✅ **6. Index Page (Initial Data)**

**Database Tables:**
1. **`specializations`** - Ambil semua untuk dropdown
   ```php
   Specialization::all('Id_specializations', 'name')
   ```

2. **`available_days`** - Ambil semua untuk dropdown
   ```php
   AvailableDay::orderBy('sort_order')->get(['Id_day', 'name', 'sort_order'])
   ```

---

## 🟨 **HALAMAN 3: RIWAYAT PERTEMUAN**

### **Controller:** `app/Http/Controllers/Admin/RiwayatPertemuanController.php`

### ✅ **1. Index (Halaman Riwayat)**

**Database Operations:**
```php
Schedule::query()
    ->select('training_type')
    ->distinct()
    ->orderBy('training_type')
    ->pluck('training_type');
```

**Database Table:** `schedules`
- Kolom: `training_type`
- Purpose: Ambil daftar training type yang unik untuk filter dropdown

---

### ✅ **2. Get Data (List Riwayat)**

**Kode:**
```php
$query = Schedule::query()
    ->with(['member:id_user,name', 'mentor:id_user,name'])
    ->where('status', 'completed');
```

**Database Tables Yang Digunakan:**
1. **`schedules`** (Primary Table)
   - Kolom: 
     - `Id_schedles` (primary key)
     - `member_id`, `mentor_id`
     - `proposed_date`, `proposed_time`
     - `training_type`
     - `materi_modul`, `materi_topik`, `materi_sub_topik`
     - `status` (filter: 'completed')
   - Order by: `proposed_date DESC`, `proposed_time DESC`

2. **`users`** (Via relationships)
   - Kolom: `id_user`, `name`
   - Relationship: 
     - `member_id` → `users.id_user` (as member)
     - `mentor_id` → `users.id_user` (as mentor)

3. **`materi`** (Untuk resolve pertemuan number)
   - Kolom: `modul`, `topik`, `pertemuan`
   - Query: 
     ```php
     Materi::where('modul', $schedule->materi_modul)
         ->where('topik', $schedule->materi_topik)
         ->orderBy('pertemuan')
         ->first();
     ```

**Features:**
- ✅ Filter by training type: `training_type` dari schedules
- ✅ Pagination: Default 10 per page (bisa diubah via parameter)
- ✅ Hanya status: `completed`
- ✅ Order by: Most recent (`proposed_date DESC`, `proposed_time DESC`)

**Kolom yang Dikirim ke Frontend:**
```php
[
    'id' => $schedule->Id_schedles,
    'member_name' => $schedule->member->name,
    'mentor_name' => $schedule->mentor->name,
    'proposed_date' => $schedule->proposed_date,
    'proposed_time' => $schedule->proposed_time,
    'training_type' => $schedule->training_type,
    'materi_modul' => $schedule->materi_modul,
    'materi_topik' => $schedule->materi_topik,
    'materi_sub_topik' => $schedule->materi_sub_topik,
    'pertemuan' => $materi->pertemuan, // FROM materi table
]
```

---

## 📊 **RINGKASAN DATABASE TABLES**

### **Tabel yang Digunakan di Semua Halaman:**

1. **`users`** - Data user (member, mentor, admin)
   - Kolom penting: `id_user`, `name`, `email`, `role`, `status`

2. **`member_profiles`** - Profil member
   - Kolom penting: `Id_member`, `user_id`, `phone`, `meeting_type`, `remaining_sessions`, `Id_specializations`

3. **`mentor_profiles`** - Profil mentor
   - Kolom penting: `Id_mentor`, `user_id`, `phone`, `specialization_ids` (JSON), `available_day_ids` (JSON)

4. **`specializations`** - Data specialization/pelatihan
   - Kolom penting: `Id_specializations`, `name`

5. **`available_days`** - Data hari tersedia
   - Kolom penting: `Id_day`, `name`, `sort_order`

6. **`schedules`** - Jadwal pertemuan
   - Kolom penting: `Id_schedles`, `member_id`, `mentor_id`, `proposed_date`, `proposed_time`, `training_type`, `status`, `materi_modul`, `materi_topik`, `materi_sub_topik`

7. **`meetings`** - Data pertemuan
   - Kolom penting: `member_id`, `mentor_id`, `status`, `topic`, `notes`, `feedback`, `rating`

8. **`ratings`** - Data rating dan ulasan
   - Kolom penting: `id_rating`, `mentor_id`, `member_id`, `rating`, `review`

9. **`materi`** - Data materi pembelajaran
   - Kolom penting: `modul`, `topik`, `pertemuan`

---

## ✅ **KESIMPULAN**

### **SEMUA DATA DIAMBIL DARI DATABASE ✓**

| Halaman | Tabel Database | Status |
|---------|---------------|---------|
| Member Management | `users`, `member_profiles`, `specializations` | ✅ Real Data |
| Mentor Management | `users`, `mentor_profiles`, `ratings`, `meetings`, `specializations`, `available_days` | ✅ Real Data |
| Riwayat Pertemuan | `schedules`, `users`, `materi` | ✅ Real Data |

**Tidak ada data hardcoded atau dummy di semua halaman admin.**

All CRUD operations properly interact with database tables.
All queries use proper eager loading and relationships.
All statistics and counts are calculated from database.

---

## 🔧 **CATATAN PENTING**

1. **MentorProfile menggunakan JSON fields:**
   - `specialization_ids` - Array of Id_specializations (JSON)
   - `available_day_ids` - Array of Id_day (JSON)

2. **Filter JSON dengan `whereJsonContains`:**
   ```php
   $query->whereHas('mentorProfile', function ($specQuery) use ($request) {
       $specQuery->whereJsonContains('specialization_ids', $request->input('specialization_id'));
   });
   ```

3. **CASCADE DELETE untuk integrity:**
   - Saat delete user, semua data terkait dihapus dari: meetings, ratings, schedules, meeting_history

4. **Statistics calculated in real-time:**
   - Member stats: Total, Daring, Luring
   - Mentor stats: ratings count, average rating, completed meetings count


