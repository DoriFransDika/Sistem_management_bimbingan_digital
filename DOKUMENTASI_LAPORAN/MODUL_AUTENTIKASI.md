# MODUL AUTENTIKASI (AUTHENTICATION MODULE)
## Front-End Logic Script & Penjelasan

---

## 1. OVERVIEW MODUL AUTENTIKASI

Modul autentikasi berfungsi untuk mengelola proses login pengguna ke dalam sistem. Modul ini menggunakan React dengan Inertia.js untuk komunikasi dengan backend Laravel.

---

## 2. FILE UTAMA: `Login.jsx`

### 2.1 Import Dependencies

```jsx
import Checkbox from '@/Components/Login/Checkbox';
import InputError from '@/Components/Login/InputError';
import InputLabel from '@/Components/Login/InputLabel';
import PrimaryButton from '@/Components/Login/PrimaryButton';
import TextInput from '@/Components/Login/TextInput';
import ApplicationLogo from '@/Components/Login/ApplicationLogo';
import GuestLayout from '@/Pages/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
```

**Penjelasan:**
- **`@/Components/Login/*`**: Komponen reusable untuk form login (Checkbox, Input, Button, dll)
- **`@/Pages/Layouts/GuestLayout`**: Layout khusus untuk halaman yang tidak memerlukan autentikasi
- **`@inertiajs/react`**: Library Inertia.js untuk React, digunakan untuk navigasi SPA tanpa reload
- **`useState`**: Hook React untuk mengelola state lokal (contoh: show/hide password)

---

### 2.2 State Management dengan useForm

```jsx
const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
});
```

**Penjelasan:**
- **`useForm`**: Hook dari Inertia.js untuk mengelola form state
  - **`data`**: Object yang menyimpan nilai form (email, password, remember)
  - **`setData`**: Function untuk update nilai form
  - **`post`**: Function untuk submit form via POST request
  - **`processing`**: Boolean yang menunjukkan status loading saat submit
  - **`errors`**: Object yang menyimpan error validation dari backend
  - **`reset`**: Function untuk mereset form ke nilai awal

---

### 2.3 State untuk Show/Hide Password

```jsx
const [showPassword, setShowPassword] = useState(false);
```

**Penjelasan:**
- **`showPassword`**: State boolean untuk toggle visibility password
- **`setShowPassword`**: Function untuk mengubah nilai showPassword
- Digunakan untuk fitur "show password" agar user dapat melihat password yang diketik

---

### 2.4 Function Submit Form

```jsx
const submit = (e) => {
    e.preventDefault(); // Mencegah default form submission
    
    post(route('login'), {
        onFinish: () => reset('password'), // Reset password setelah submit
    });
};
```

**Penjelasan:**
- **`e.preventDefault()`**: Mencegah form melakukan default HTML form submission
- **`post(route('login'))`**: Mengirim data form ke route 'login' di backend Laravel
- **`onFinish`**: Callback yang dieksekusi setelah request selesai (success/error)
- **`reset('password')`**: Mengosongkan field password setelah submit untuk keamanan

---

### 2.5 Struktur JSX - Layout Dua Kolom

```jsx
<div className="flex w-full max-w-6xl rounded-2xl overflow-hidden shadow-xl">
    {/* Kolom Kiri: Section Iklan */}
    <div className="flex-1 bg-gradient-to-br from-blue-400 to-slate-50">
        {/* Konten iklan */}
    </div>
    
    {/* Kolom Kanan: Form Login */}
    <div className="flex-1 bg-white">
        {/* Form login */}
    </div>
</div>
```

**Penjelasan:**
- **Layout Split Screen**: Membagi tampilan menjadi 2 kolom (50:50)
- **Kolom Kiri**: Area untuk iklan/promosi menggunakan gradient background
- **Kolom Kanan**: Area untuk form login dengan background putih
- **Tailwind CSS Classes**: 
  - `flex`: Mengaktifkan flexbox layout
  - `max-w-6xl`: Membatasi lebar maksimum container
  - `rounded-2xl`: Memberikan border radius untuk desain modern

---

### 2.6 Form Input Email

```jsx
<div>
    <InputLabel htmlFor="email" value="Email" />
    
    <TextInput
        id="email"
        type="email"
        name="email"
        value={data.email}
        onChange={(e) => setData('email', e.target.value)}
        autoComplete="username"
        isFocused={true}
    />
    
    <InputError message={errors.email} />
</div>
```

**Penjelasan:**
- **`InputLabel`**: Komponen label untuk input dengan styling konsisten
- **`TextInput`**: Komponen input reusable dengan styling Tailwind
- **`value={data.email}`**: Two-way binding - nilai input terhubung dengan state
- **`onChange`**: Event handler untuk update state saat user mengetik
- **`autoComplete="username"`**: Memberikan hint ke browser untuk autofill
- **`isFocused={true}`**: Auto focus pada input saat halaman dimuat
- **`InputError`**: Menampilkan error message dari backend validation

---

### 2.7 Password Input dengan Toggle Visibility

```jsx
<div className="relative">
    <TextInput
        id="password"
        type={showPassword ? "text" : "password"}
        value={data.password}
        onChange={(e) => setData('password', e.target.value)}
        className="pr-10"
    />
    <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3"
        onClick={() => setShowPassword(!showPassword)}
    >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
    </button>
</div>
```

**Penjelasan:**
- **`type={showPassword ? "text" : "password"}`**: Conditional type attribute
  - Jika `showPassword = true`, type = "text" (terlihat)
  - Jika `showPassword = false`, type = "password" (tersembunyi)
- **`relative`**: Positioning context untuk button absolute
- **`absolute inset-y-0 right-0`**: Button diposisikan di kanan tengah input
- **`onClick={() => setShowPassword(!showPassword)}`**: Toggle state saat button diklik

---

### 2.8 Checkbox "Remember Me"

```jsx
<label className="flex items-center">
    <Checkbox
        name="remember"
        checked={data.remember}
        onChange={(e) => setData('remember', e.target.checked)}
    />
    <span>Remember me</span>
</label>
```

**Penjelasan:**
- **`checked={data.remember}`**: Controlled component - nilai checkbox terhubung dengan state
- **`onChange={(e) => setData('remember', e.target.checked)}`**: 
  - `e.target.checked` mengembalikan boolean (true/false)
  - Update state saat checkbox di-toggle

---

### 2.9 Submit Button dengan Loading State

```jsx
<PrimaryButton 
    className="bg-blue-600 hover:bg-blue-700"
    disabled={processing}
>
    {processing ? 'Logging in...' : 'Log in'}
</PrimaryButton>
```

**Penjelasan:**
- **`disabled={processing}`**: Disable button saat proses login berlangsung
  - Mencegah double submission
  - Memberikan feedback visual ke user
- **`{processing ? 'Logging in...' : 'Log in'}`**: Conditional rendering
  - Menampilkan text berbeda berdasarkan status processing

---

### 2.10 Error Handling

```jsx
{status && (
    <div className="mb-4 p-3 bg-green-50 border border-green-200">
        <div className="text-sm font-medium text-green-700">
            {status}
        </div>
    </div>
)}

<InputError message={errors.email} />
<InputError message={errors.password} />
```

**Penjelasan:**
- **`status`**: Props dari backend (contoh: "Login berhasil" atau pesan lainnya)
- **`errors.email`**: Object error validation untuk field email
- **`errors.password`**: Object error validation untuk field password
- Error ditampilkan di bawah setiap input field untuk UX yang lebih baik

---

## 3. ALUR KERJA MODUL AUTENTIKASI

### Flowchart Logic:

```
1. User membuka halaman Login
   ↓
2. User mengisi email dan password
   ↓
3. User mengklik tombol "Log in"
   ↓
4. Front-end: Validasi client-side (opsional)
   ↓
5. Front-end: Mengirim data ke backend via POST request
   ↓
6. Backend: Validasi data
   ↓
7. Backend: Check credentials di database
   ↓
8a. Jika BERHASIL:
    - Backend: Generate session/token
    - Backend: Redirect ke dashboard
    - Front-end: Inertia.js handle redirect (tanpa reload)
    
8b. Jika GAGAL:
    - Backend: Return error validation
    - Front-end: Tampilkan error message
    - User dapat mengulangi proses
```

---

## 4. KEAMANAN YANG DITERAPKAN

1. **HTTPS**: Semua komunikasi dienkripsi (harus dikonfigurasi di server)
2. **CSRF Protection**: Laravel secara otomatis menambahkan CSRF token
3. **Password Hashing**: Password di-hash di backend sebelum disimpan
4. **Rate Limiting**: Mencegah brute force attack (dikonfigurasi di backend)
5. **Input Validation**: Validasi di front-end dan back-end

---

## 5. BEST PRACTICES YANG DITERAPKAN

1. **Reusable Components**: Input, Button, dll dibuat sebagai komponen terpisah
2. **Separation of Concerns**: Logic dan UI dipisahkan
3. **Error Handling**: Error ditampilkan dengan jelas ke user
4. **Loading State**: User mendapat feedback saat proses berlangsung
5. **Accessibility**: Label yang jelas, auto-complete, dan keyboard navigation
6. **Responsive Design**: Layout adaptif untuk mobile dan desktop

---

## 6. KESIMPULAN

Modul autentikasi menggunakan pendekatan modern dengan:
- **React Hooks** untuk state management
- **Inertia.js** untuk komunikasi SPA dengan Laravel
- **Controlled Components** untuk form handling
- **Error Handling** yang comprehensive
- **UX Design** yang user-friendly dengan loading states dan error messages

Modul ini memastikan keamanan dan kenyamanan pengguna dalam proses autentikasi sistem.




