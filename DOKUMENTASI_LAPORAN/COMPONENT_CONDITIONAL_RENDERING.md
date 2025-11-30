# KOMPONEN DENGAN CONDITIONAL RENDERING & ROLE-BASED LOGIC
## Front-End Logic Script & Penjelasan Detail

---

## 1. OVERVIEW CONDITIONAL RENDERING

Conditional rendering adalah teknik dalam React untuk menampilkan konten berbeda berdasarkan kondisi tertentu. Dalam aplikasi ini, conditional rendering digunakan untuk:
- Menampilkan menu berbeda berdasarkan status autentikasi user
- Mengatur akses berdasarkan role (Admin, Mentor, Member)
- Menampilkan UI berbeda berdasarkan state komponen

---

## 2. KOMPONEN NAVBAR DENGAN CONDITIONAL RENDERING

### 2.1 File: `Navbar.jsx`

Komponen Navbar menampilkan menu navigasi yang berbeda untuk user yang sudah login dan yang belum login.

---

### 2.2 Import Dependencies

```jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
```

**Penjelasan:**
- **`React`**: Library untuk membuat komponen
- **`Link`**: Komponen Inertia.js untuk navigasi SPA tanpa reload
- **`usePage`**: Hook Inertia.js untuk mengakses props dari Laravel backend

---

### 2.3 Props Component

```jsx
const Navbar = ({ auth }) => {
```

**Penjelasan:**
- **`auth`**: Props dari Laravel backend yang berisi data autentikasi
  - **`auth.user`**: Object user jika sudah login, atau `null` jika belum login
  - **`auth.user.name`**: Nama user yang login
  - **`auth.user.email`**: Email user yang login
  - **`auth.user.role`**: Role user (admin, mentor, member)

---

### 2.4 Conditional Rendering dengan Ternary Operator

```jsx
{auth.user ? (
    <Link href={route('dashboard')} className="font-semibold text-white hover:text-gray-300">
        Dashboard
    </Link>
) : (
    <>
        <Link
            href={route('login')}
            className="bg-white text-blue-950 font-bold py-2 px-4 rounded-full shadow-lg">
            Masuk
        </Link>
    </>
)}
```

**Penjelasan Detail:**

#### A. Struktur Conditional Rendering

```jsx
{condition ? (true_case) : (false_case)}
```

- **Ternary Operator (`? :`)**: Operator JavaScript untuk conditional expression
  - **`condition`**: Ekspresi yang dievaluasi (boolean)
  - **`true_case`**: Kode yang dieksekusi jika condition `true`
  - **`false_case`**: Kode yang dieksekusi jika condition `false`

#### B. Condition: `auth.user`

```jsx
auth.user
```

**Penjelasan:**
- **Truthy Value**: Jika `auth.user` ada (object), dievaluasi sebagai `true`
- **Falsy Value**: Jika `auth.user` adalah `null` atau `undefined`, dievaluasi sebagai `false`

**Contoh:**
```jsx
// Jika user sudah login
auth.user = { name: "John Doe", email: "john@example.com", role: "admin" }
// auth.user = true (truthy)

// Jika user belum login
auth.user = null
// auth.user = false (falsy)
```

#### C. True Case: Tampilkan Link Dashboard

```jsx
<Link href={route('dashboard')} className="...">
    Dashboard
</Link>
```

**Penjelasan:**
- **Jika user sudah login** (`auth.user` = truthy):
  - Tampilkan link "Dashboard"
  - Link mengarah ke route `dashboard`
  - User dapat mengakses dashboard mereka

#### D. False Case: Tampilkan Tombol Masuk

```jsx
<>
    <Link
        href={route('login')}
        className="bg-white text-blue-950 font-bold py-2 px-4 rounded-full">
        Masuk
    </Link>
</>
```

**Penjelasan:**
- **Jika user belum login** (`auth.user` = falsy):
  - Tampilkan tombol "Masuk"
  - Link mengarah ke route `login`
  - User dapat login ke sistem

#### E. Fragment (`<>...</>`)

```jsx
<>
    {/* Multiple elements */}
</>
```

**Penjelasan:**
- **React Fragment**: Wrapper untuk multiple elements tanpa menambahkan DOM node
- Diperlukan jika false_case berisi lebih dari satu element

---

### 2.5 Conditional Rendering dengan Logical AND (`&&`)

```jsx
{auth.user && (
    <div className="user-info">
        <p>Selamat datang, {auth.user.name}</p>
    </div>
)}
```

**Penjelasan:**
- **Logical AND (`&&`)**: Menampilkan element hanya jika condition `true`
- **Jika `auth.user` = truthy**: Render element
- **Jika `auth.user` = falsy**: Tidak render apa-apa (return `null`)

**Perbedaan dengan Ternary Operator:**
```jsx
// Ternary: Selalu render sesuatu (true atau false case)
{condition ? <TrueCase /> : <FalseCase />}

// Logical AND: Hanya render jika true, tidak ada false case
{condition && <Element />}
```

---

### 2.6 Conditional Rendering dengan Null Coalescing (`??`)

```jsx
<p>Hi, {auth?.user?.name ?? 'Guest'}</p>
```

**Penjelasan:**
- **Optional Chaining (`?.`)**: Safe access untuk nested properties
  - Jika `auth` null/undefined, return `undefined` (tidak error)
  - Jika `auth.user` null/undefined, return `undefined` (tidak error)
  
- **Null Coalescing (`??`)**: Mengembalikan default value jika null/undefined
  - Jika `auth?.user?.name` = null/undefined → return `'Guest'`
  - Jika `auth?.user?.name` = "John" → return `"John"`

**Contoh:**
```jsx
// Jika auth.user = null
auth?.user?.name ?? 'Guest'  // Result: 'Guest'

// Jika auth.user = { name: "John" }
auth?.user?.name ?? 'Guest'  // Result: 'John'

// Jika auth = null
auth?.user?.name ?? 'Guest'  // Result: 'Guest' (tidak error)
```

---

### 2.7 Contoh Lengkap Navbar Component

```jsx
const Navbar = ({ auth }) => {
    return (
        <header className="fixed top-0 left-20 right-10 z-50 bg-blue-950">
            <div className="flex items-center">
                <img src="/img/mediatama.png" alt="Logo" className="h-16" />
                <span className="ml-2 text-2xl font-bold text-white">
                    MEDIATAMA WEB
                </span>
            </div>
            
            <nav className="flex space-x-6 items-center">
                <Link href="/" className="text-white hover:text-gray-300">
                    Beranda
                </Link>
                <Link href="#fitur" className="text-white hover:text-gray-300">
                    Fitur
                </Link>
                <Link href="#faq" className="text-white hover:text-gray-300">
                    FAQ
                </Link>
                
                {/* CONDITIONAL RENDERING BERDASARKAN AUTH STATUS */}
                {auth.user ? (
                    // CASE 1: User sudah login
                    <Link href={route('dashboard')} className="text-white">
                        Dashboard
                    </Link>
                ) : (
                    // CASE 2: User belum login
                    <Link
                        href={route('login')}
                        className="bg-white text-blue-950 font-bold py-2 px-4 rounded-full">
                        Masuk
                    </Link>
                )}
            </nav>
        </header>
    );
};
```

---

## 3. KOMPONEN SIDEBAR DENGAN SWITCH CASE & CONDITIONAL LOGIC

### 3.1 File: `Sidebar.jsx`

Komponen Sidebar untuk Admin dengan conditional rendering untuk menu aktif dan switch case untuk navigation.

---

### 3.2 Conditional Rendering untuk Menu Active State

```jsx
const menuItems = [
    { name: 'DASHBOARD', active: activeMenu === 'DASHBOARD' },
    { name: 'Manajemen Member', active: activeMenu === 'Manajemen Member' },
    { name: 'Manajemen Mentor', active: activeMenu === 'Manajemen Mentor' },
    { name: 'Verifikasi Pertemuan', active: activeMenu === 'Verifikasi Pertemuan' },
    { name: 'Riwayat Pertemuan', active: activeMenu === 'Riwayat Pertemuan' },
    { name: 'Notifikasi', active: activeMenu === 'Notifikasi' },
];
```

**Penjelasan:**
- **`activeMenu`**: Props yang berisi nama menu yang sedang aktif
- **Comparison Operator (`===`)**: Strict equality untuk membandingkan nilai
  - `activeMenu === 'DASHBOARD'` → `true` jika menu DASHBOARD aktif
  - `activeMenu === 'DASHBOARD'` → `false` jika menu lain yang aktif

**Contoh:**
```jsx
// Jika activeMenu = 'DASHBOARD'
activeMenu === 'DASHBOARD'  // true
activeMenu === 'Manajemen Member'  // false

// Jika activeMenu = 'Manajemen Member'
activeMenu === 'DASHBOARD'  // false
activeMenu === 'Manajemen Member'  // true
```

---

### 3.3 Conditional Styling dengan Template Literal

```jsx
<button
    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        item.active 
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
>
    {item.name}
</button>
```

**Penjelasan Detail:**

#### A. Template Literal dengan Ternary Operator

```jsx
`base-classes ${condition ? 'true-classes' : 'false-classes'}`
```

- **Template Literal (`` ` ``)**: String interpolation dalam JavaScript
- **Ternary Operator dalam Template**: Conditional classes

#### B. Base Classes (Selalu Diterapkan)

```jsx
"w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors"
```

**Penjelasan:**
- Classes yang selalu diterapkan untuk semua state menu:
  - `w-full`: Full width
  - `text-left`: Text alignment left
  - `px-4 py-3`: Padding
  - `rounded-lg`: Border radius
  - `transition-colors`: Smooth color transition

#### C. Active State Classes (Jika Menu Aktif)

```jsx
'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600'
```

**Penjelasan:**
- Classes yang diterapkan jika `item.active = true`:
  - `bg-blue-50`: Background color blue light
  - `dark:bg-blue-900/30`: Dark mode background
  - `text-blue-700`: Text color blue
  - `border-l-4 border-blue-600`: Left border indicator

**Visual Effect:**
- Menu aktif akan memiliki background biru dan border kiri
- Memberikan visual feedback ke user

#### D. Inactive State Classes (Jika Menu Tidak Aktif)

```jsx
'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
```

**Penjelasan:**
- Classes yang diterapkan jika `item.active = false`:
  - `text-gray-600`: Text color gray
  - `hover:bg-gray-100`: Background saat hover
  - `dark:hover:bg-gray-700`: Dark mode hover

**Visual Effect:**
- Menu tidak aktif akan memiliki style normal
- Akan berubah saat di-hover

---

### 3.4 Switch Case untuk Navigation Logic

```jsx
const handleMenuClick = (menuName) => {
    // Handle navigation berdasarkan menu
    switch(menuName) {
        case 'DASHBOARD':
            router.get(route('admin.dashboard'));
            break;
        case 'Manajemen Member':
            router.get(route('admin.members.index'));
            break;
        case 'Manajemen Mentor':
            router.get(route('admin.mentors.index'));
            break;
        case 'Verifikasi Pertemuan':
            router.get(route('admin.verification.index'));
            break;
        case 'Riwayat Pertemuan':
            router.get(route('admin.riwayat.index'));
            break;
        case 'Notifikasi':
            router.get(route('admin.notifications.index'));
            break;
        default:
            console.warn('Unknown menu:', menuName);
            break;
    }
};
```

**Penjelasan Detail:**

#### A. Switch Statement Structure

```jsx
switch(expression) {
    case value1:
        // code block
        break;
    case value2:
        // code block
        break;
    default:
        // default code block
        break;
}
```

- **`switch(expression)`**: Mengevaluasi expression sekali
- **`case value`**: Memeriksa apakah expression sama dengan value
- **`break`**: Menghentikan eksekusi switch (penting!)
- **`default`**: Case yang dieksekusi jika tidak ada case yang cocok

#### B. Case-by-Case Explanation

**Case 1: DASHBOARD**
```jsx
case 'DASHBOARD':
    router.get(route('admin.dashboard'));
    break;
```
- **Action**: Navigate ke halaman dashboard admin
- **Route**: `admin.dashboard`

**Case 2: Manajemen Member**
```jsx
case 'Manajemen Member':
    router.get(route('admin.members.index'));
    break;
```
- **Action**: Navigate ke halaman manajemen member
- **Route**: `admin.members.index`

**Case 3: Manajemen Mentor**
```jsx
case 'Manajemen Mentor':
    router.get(route('admin.mentors.index'));
    break;
```
- **Action**: Navigate ke halaman manajemen mentor
- **Route**: `admin.mentors.index`

**Default Case:**
```jsx
default:
    console.warn('Unknown menu:', menuName);
    break;
```
- **Purpose**: Handle unknown menu names
- **Action**: Log warning ke console
- **Safety**: Mencegah error jika menu name tidak terdaftar

#### C. Kenapa Menggunakan Switch Case?

**Keuntungan:**
1. **Lebih Readable**: Lebih mudah dibaca dibanding if-else chain
2. **Performance**: Biasanya lebih cepat untuk banyak kondisi
3. **Maintainable**: Mudah ditambah/kurangi case baru

**Perbandingan dengan If-Else:**

```jsx
// If-Else Chain
if (menuName === 'DASHBOARD') {
    router.get(route('admin.dashboard'));
} else if (menuName === 'Manajemen Member') {
    router.get(route('admin.members.index'));
} else if (menuName === 'Manajemen Mentor') {
    router.get(route('admin.mentors.index'));
} else {
    console.warn('Unknown menu:', menuName);
}

// Switch Case (Lebih Clean)
switch(menuName) {
    case 'DASHBOARD':
        router.get(route('admin.dashboard'));
        break;
    case 'Manajemen Member':
        router.get(route('admin.members.index'));
        break;
    // ...
}
```

---

### 3.5 Conditional Rendering dengan Optional Chaining

```jsx
<p className="text-xs text-gray-500 dark:text-gray-400">
    Hi, {auth?.user?.name || 'Administrator'}
</p>
```

**Penjelasan Detail:**

#### A. Optional Chaining (`?.`)

```jsx
auth?.user?.name
```

**Penjelasan:**
- **Safe Property Access**: Mengakses nested property tanpa error
- **Jika `auth` = null/undefined**:
  - `auth?.user` → return `undefined` (tidak error)
  - `auth?.user?.name` → return `undefined` (tidak error)
  
- **Jika `auth` = { user: { name: "John" } }**:
  - `auth?.user` → return `{ name: "John" }`
  - `auth?.user?.name` → return `"John"`

**Tanpa Optional Chaining (Error-prone):**
```jsx
// Jika auth = null, akan error: "Cannot read property 'user' of null"
auth.user.name  // ❌ Error!

// Dengan Optional Chaining (Safe)
auth?.user?.name  // ✅ Return undefined jika null
```

#### B. Logical OR (`||`) untuk Default Value

```jsx
auth?.user?.name || 'Administrator'
```

**Penjelasan:**
- **Logical OR (`||`)**: Mengembalikan nilai pertama yang truthy
- **Jika `auth?.user?.name` = truthy** (contoh: "John"):
  - Return `"John"`
  
- **Jika `auth?.user?.name` = falsy** (null, undefined, "", 0):
  - Return `'Administrator'` (default value)

**Contoh:**
```jsx
// Jika auth.user.name = "John Doe"
auth?.user?.name || 'Administrator'  // Result: "John Doe"

// Jika auth.user.name = null
auth?.user?.name || 'Administrator'  // Result: "Administrator"

// Jika auth = null
auth?.user?.name || 'Administrator'  // Result: "Administrator"
```

---

### 3.6 Conditional Rendering dalam Event Handler

```jsx
const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
        if (typeof router !== 'undefined') {
            router.post(route("logout"), {}, {
                onSuccess: () => {
                    window.location.href = "/login";
                }
            });
        } else {
            // Fallback untuk demo
            alert("Logout berhasil!");
        }
    }
};
```

**Penjelasan Detail:**

#### A. Nested If Statements

```jsx
if (condition1) {
    if (condition2) {
        // code block
    } else {
        // else block
    }
}
```

**Penjelasan:**
- **Nested If**: If statement di dalam if statement
- **Outer If**: Check user confirmation
- **Inner If**: Check router availability

#### B. Outer If: User Confirmation

```jsx
if (confirm("Apakah Anda yakin ingin logout?")) {
    // Execute logout
}
```

**Penjelasan:**
- **`confirm()`**: Browser function untuk menampilkan confirmation dialog
- **Return**: `true` jika user klik OK, `false` jika Cancel
- **Purpose**: Mencegah accidental logout

**Flow:**
1. User klik tombol logout
2. Dialog muncul: "Apakah Anda yakin ingin logout?"
3. User klik OK → `confirm()` return `true` → Execute logout
4. User klik Cancel → `confirm()` return `false` → Tidak execute logout

#### C. Inner If: Router Availability Check

```jsx
if (typeof router !== 'undefined') {
    // Use router
} else {
    // Fallback
}
```

**Penjelasan:**
- **`typeof`**: Operator JavaScript untuk check tipe data
- **`typeof router !== 'undefined'`**: Check apakah router ada
- **Purpose**: Fallback jika router tidak tersedia (misalnya dalam environment testing)

**Logic:**
- **Jika router tersedia**: Gunakan router untuk logout
- **Jika router tidak tersedia**: Gunakan fallback (alert)

---

## 4. CONDITIONAL RENDERING BERDASARKAN ROLE

### 4.1 Contoh: Role-Based Menu Rendering

```jsx
const Navigation = ({ auth }) => {
    const user = auth?.user;
    const role = user?.role;
    
    return (
        <nav>
            {/* Menu yang sama untuk semua role */}
            <Link href="/dashboard">Dashboard</Link>
            
            {/* Menu khusus Admin */}
            {role === 'admin' && (
                <>
                    <Link href="/admin/members">Manajemen Member</Link>
                    <Link href="/admin/mentors">Manajemen Mentor</Link>
                    <Link href="/admin/verification">Verifikasi</Link>
                </>
            )}
            
            {/* Menu khusus Mentor */}
            {role === 'mentor' && (
                <>
                    <Link href="/mentor/requests">Permintaan Masuk</Link>
                    <Link href="/mentor/schedule">Jadwal Saya</Link>
                    <Link href="/mentor/report">Kirim Laporan</Link>
                </>
            )}
            
            {/* Menu khusus Member */}
            {role === 'member' && (
                <>
                    <Link href="/member/schedule">Jadwal Saya</Link>
                    <Link href="/member/history">Riwayat</Link>
                </>
            )}
        </nav>
    );
};
```

**Penjelasan:**

#### A. Role Extraction

```jsx
const user = auth?.user;
const role = user?.role;
```

- **Extract user data**: Ambil user object dari auth
- **Extract role**: Ambil role dari user object

#### B. Role-Based Conditional Rendering

```jsx
{role === 'admin' && (
    <AdminMenu />
)}
```

**Penjelasan:**
- **Strict Equality (`===`)**: Membandingkan role dengan string literal
- **Logical AND (`&&`)**: Render menu hanya jika role match
- **Jika `role === 'admin'`**: Render admin menu
- **Jika `role !== 'admin'`**: Tidak render (return null)

#### C. Multiple Role Conditions

```jsx
{role === 'admin' && <AdminMenu />}
{role === 'mentor' && <MentorMenu />}
{role === 'member' && <MemberMenu />}
```

**Penjelasan:**
- Setiap role memiliki menu tersendiri
- Hanya satu menu yang akan dirender sesuai role user
- Tidak ada conflict karena hanya satu condition yang true

---

### 4.2 Contoh: Ternary Operator untuk Multiple Roles

```jsx
const getDashboardRoute = (role) => {
    return role === 'admin' 
        ? '/admin/dashboard'
        : role === 'mentor'
        ? '/mentor/dashboard'
        : role === 'member'
        ? '/member/dashboard'
        : '/login';
};

// Usage
<Link href={getDashboardRoute(auth?.user?.role)}>
    Dashboard
</Link>
```

**Penjelasan:**

#### A. Nested Ternary Operator

```jsx
condition1 
    ? value1
    : condition2
    ? value2
    : condition3
    ? value3
    : defaultValue
```

**Penjelasan:**
- **Nested Ternary**: Ternary operator di dalam ternary operator
- **Flow**: Check condition1 → jika false, check condition2 → jika false, check condition3 → jika semua false, return defaultValue

**Logic:**
1. Jika `role === 'admin'` → return `/admin/dashboard`
2. Jika tidak, check `role === 'mentor'` → return `/mentor/dashboard`
3. Jika tidak, check `role === 'member'` → return `/member/dashboard`
4. Jika tidak ada yang match → return `/login`

---

## 5. CONDITIONAL RENDERING DENGAN IF STATEMENT

### 5.1 Early Return Pattern

```jsx
const UserProfile = ({ auth }) => {
    // Early return jika user tidak login
    if (!auth?.user) {
        return (
            <div className="alert">
                <p>Silakan login untuk melihat profile</p>
                <Link href="/login">Login</Link>
            </div>
        );
    }
    
    // Code untuk user yang sudah login
    return (
        <div className="profile">
            <h1>{auth.user.name}</h1>
            <p>{auth.user.email}</p>
        </div>
    );
};
```

**Penjelasan:**

#### A. Early Return

```jsx
if (!condition) {
    return <EarlyReturnComponent />;
}

// Continue with normal rendering
return <NormalComponent />;
```

**Penjelasan:**
- **Early Return**: Return component lebih awal jika condition tidak terpenuhi
- **Guard Clause**: Pattern untuk menghindari nested if statements
- **Benefits**:
  - Lebih readable
  - Mengurangi nesting
  - Clear logic flow

#### B. Logical NOT (`!`)

```jsx
if (!auth?.user) {
    // Execute if auth.user is falsy
}
```

**Penjelasan:**
- **Logical NOT (`!`)**: Membalikkan nilai boolean
- **`!auth?.user`**: True jika auth.user adalah falsy (null, undefined, false, 0, "")

**Contoh:**
```jsx
// Jika auth.user = null
!auth?.user  // true → Execute early return

// Jika auth.user = { name: "John" }
!auth?.user  // false → Continue normal rendering
```

---

## 6. BEST PRACTICES CONDITIONAL RENDERING

### 6.1 Gunakan Ternary untuk 2 Cases

```jsx
// ✅ Good: Ternary untuk 2 cases
{isLoggedIn ? <Dashboard /> : <Login />}

// ❌ Avoid: Ternary untuk 3+ cases
{role === 'admin' ? <Admin /> : role === 'mentor' ? <Mentor /> : <Member />}
// Lebih baik gunakan switch case atau early return
```

### 6.2 Gunakan Logical AND untuk Single Case

```jsx
// ✅ Good: Logical AND untuk single case
{isAdmin && <AdminPanel />}

// ❌ Avoid: Ternary dengan null
{isAdmin ? <AdminPanel /> : null}
```

### 6.3 Gunakan Early Return untuk Guard Clauses

```jsx
// ✅ Good: Early return
if (!user) return <Login />;
return <Dashboard />;

// ❌ Avoid: Nested if
if (user) {
    return <Dashboard />;
} else {
    return <Login />;
}
```

### 6.4 Extract Complex Conditions ke Variables

```jsx
// ✅ Good: Extract condition
const isAdmin = auth?.user?.role === 'admin';
const canEdit = isAdmin || auth?.user?.id === post.author_id;

return (
    <>
        {isAdmin && <AdminMenu />}
        {canEdit && <EditButton />}
    </>
);

// ❌ Avoid: Inline complex condition
{auth?.user?.role === 'admin' && (auth?.user?.id === post.author_id || true) && <EditButton />}
```

---

## 7. KESIMPULAN

Conditional rendering dalam React adalah teknik powerful untuk membuat UI yang dinamis. Dalam aplikasi ini, conditional rendering digunakan untuk:

1. **Authentication-based Rendering**: Tampilkan UI berbeda untuk user yang sudah/belum login
2. **Role-based Rendering**: Tampilkan menu berbeda berdasarkan role (Admin, Mentor, Member)
3. **State-based Rendering**: Tampilkan UI berbeda berdasarkan state komponen (active menu, loading state, dll)

**Pola-pola yang Digunakan:**
- **Ternary Operator (`? :`)**: Untuk 2 cases (true/false)
- **Logical AND (`&&`)**: Untuk single case conditional
- **Switch Case**: Untuk multiple cases navigation
- **Early Return**: Untuk guard clauses
- **Optional Chaining (`?.`)**: Untuk safe property access
- **Null Coalescing (`??`)**: Untuk default values

**Best Practices:**
- Gunakan pola yang tepat untuk setiap use case
- Extract complex conditions ke variables
- Gunakan early return untuk menghindari nesting
- Selalu handle edge cases (null, undefined)

---

## 8. REFERENSI

- React Conditional Rendering: https://react.dev/learn/conditional-rendering
- JavaScript Operators: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators
- Optional Chaining: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
- Nullish Coalescing: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing




