# MODUL DASHBOARD ADMIN
## Front-End Logic Script & Penjelasan

---

## 1. OVERVIEW MODUL DASHBOARD

Dashboard adalah halaman utama yang menampilkan ringkasan data dan statistik sistem. Modul ini terdiri dari beberapa komponen yang bekerja bersama untuk menampilkan informasi secara visual dan interaktif.

---

## 2. FILE UTAMA: `AdminDashboard.jsx`

### 2.1 Import Dependencies

```jsx
import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from "../../Components/Admin/Sidebar";
import Header from "../../Components/Admin/Header";
import StatsCards from "../../Components/Admin/StatsCards";
import Chart from "../../Components/Admin/Chart";
import MentorSessionsTable from "../../Components/Admin/MentorSessionsTable";
import RecentReviews from "../../Components/Admin/RecentReviews";
import MentorRatings from "../../Components/Admin/MentorRatings";
import NotificationPopup from "../../Components/Admin/NotificationPopup";
import { ThemeProvider } from "../../Contexts/ThemeContext";
import { NotificationProvider } from "../../Contexts/NotificationContext";
```

**Penjelasan:**
- **`useState, useEffect`**: React hooks untuk state management dan lifecycle
- **`@inertiajs/react`**: Library untuk SPA navigation
- **Komponen Dashboard**:
  - `Sidebar`: Menu navigasi sidebar
  - `Header`: Header dengan waktu dan tombol refresh
  - `StatsCards`: Kartu statistik (Total Member, Total Mentor, dll)
  - `Chart`: Grafik visualisasi data
  - `MentorSessionsTable`: Tabel sesi mentor
  - `RecentReviews`: Review terbaru
  - `MentorRatings`: Rating mentor
- **Context Providers**: 
  - `ThemeProvider`: Mengelola tema (light/dark mode)
  - `NotificationProvider`: Mengelola notifikasi sistem

---

### 2.2 Props dan Default Values

```jsx
export default function Dashboard({ 
    auth, 
    stats = {}, 
    meetings = {}, 
    mentors = [], 
    reviews = [], 
    mentorRatings = [] 
}) {
```

**Penjelasan:**
- **Props dari Backend**: Data diteruskan dari Laravel controller via Inertia.js
  - **`auth`**: Data user yang sedang login
  - **`stats`**: Statistik sistem (total member, mentor, dll)
  - **`meetings`**: Data pertemuan untuk chart
  - **`mentors`**: Data mentor
  - **`reviews`**: Review terbaru
  - **`mentorRatings`**: Rating mentor
- **Default Values**: Menggunakan `= {}` atau `= []` untuk mencegah error jika data tidak ada

---

### 2.3 State Management dengan useState

```jsx
const [currentTime, setCurrentTime] = useState(new Date());
const [loading, setLoading] = useState(false);
```

**Penjelasan:**
- **`currentTime`**: State untuk menyimpan waktu saat ini (ditampilkan di header)
- **`loading`**: State untuk menandai proses refresh data
- **`useState`**: Hook React untuk membuat reactive state

---

### 2.4 useEffect untuk Real-time Clock

```jsx
useEffect(() => {
    const timer = setInterval(() => {
        setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
}, []);
```

**Penjelasan:**
- **`useEffect`**: Hook React yang dieksekusi setelah component mount
- **`setInterval`**: Menjalankan function setiap 1000ms (1 detik)
- **`setCurrentTime(new Date())`**: Update waktu setiap detik
- **`return () => clearInterval(timer)`**: Cleanup function
  - Menghapus interval saat component unmount
  - Mencegah memory leak
- **`[]`**: Dependency array kosong = hanya jalan sekali saat mount

---

### 2.5 Function Handle Refresh

```jsx
const handleRefresh = async () => {
    try {
        setLoading(true);
        window.location.reload();
    } catch (error) {
        console.error('Error refreshing:', error);
    } finally {
        setLoading(false);
    }
};
```

**Penjelasan:**
- **`async`**: Function asynchronous untuk handle async operations
- **`setLoading(true)`**: Set loading state sebelum refresh
- **`window.location.reload()`**: Reload halaman untuk refresh data
- **`try-catch-finally`**: Error handling pattern
  - **`try`**: Kode yang mungkin error
  - **`catch`**: Handle error jika terjadi
  - **`finally`**: Selalu dieksekusi (reset loading state)

---

### 2.6 Data Processing dengan Fallback

```jsx
const currentStats = {
    totalMember: 0,
    totalMentor: 0,
    verifikasiMentor: 0,
    ...stats
};
```

**Penjelasan:**
- **Spread Operator (`...stats`)**: Menggabungkan object
  - Default values: `totalMember: 0`, dll
  - Data dari props: `...stats` akan override default jika ada
- **Tujuan**: Mencegah error jika `stats` undefined atau tidak lengkap

---

### 2.7 Struktur Layout dengan Context Providers

```jsx
return (
    <ThemeProvider>
        <NotificationProvider>
            <Head title="Admin Dashboard" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
                <Sidebar auth={auth} />
                <div className="flex-1 p-8">
                    {/* Konten dashboard */}
                </div>
            </div>
        </NotificationProvider>
    </ThemeProvider>
);
```

**Penjelasan:**
- **Context Providers**: Wrapper untuk memberikan context ke child components
  - Semua child dapat mengakses theme dan notification context
- **`min-h-screen`**: Minimum height 100vh (full screen height)
- **`flex`**: Flexbox layout untuk sidebar + content
- **`flex-1`**: Content area mengambil sisa space yang tersedia

---

### 2.8 Grid Layout untuk Komponen

```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="lg:col-span-1">
        <Chart meetings={meetings} />
    </div>
    <div className="lg:col-span-1">
        <MentorSessionsTable mentors={mentors} />
    </div>
</div>
```

**Penjelasan:**
- **CSS Grid**: Layout system yang powerful
- **`grid-cols-1`**: 1 kolom di mobile (stacking)
- **`lg:grid-cols-2`**: 2 kolom di large screen
- **`gap-8`**: Jarak antar grid items (2rem)
- **Responsive Design**: Layout berubah berdasarkan screen size

---

## 3. KOMPONEN STATS CARDS (`StatsCards.jsx`)

### 3.1 Konfigurasi Data Statistik

```jsx
const statsConfig = [
    {
        title: "Total Member",
        value: stats.totalMember,
        subtitle: "Aktif & Terdaftar",
        icon: Users,
        color: "blue"
    },
    {
        title: "Total Mentor",
        value: stats.totalMentor,
        subtitle: "Siap Membimbing",
        icon: User,
        color: "green"
    },
    {
        title: "Verifikasi Mentor",
        value: stats.verifikasiMentor,
        subtitle: "Perlu Respon Admin",
        icon: CheckCircle,
        color: "yellow"
    }
];
```

**Penjelasan:**
- **Array Configuration**: Menggunakan array untuk konfigurasi stat cards
- **Dynamic Values**: Value diambil dari props `stats`
- **Icon dari lucide-react**: Library icon modern dan customizable
- **Color Mapping**: Setiap card punya warna berbeda untuk visual distinction

---

### 3.2 Function untuk Color Mapping

```jsx
const getColorClasses = (color) => {
    const colorMap = {
        blue: { border: 'border-blue-500', text: 'text-blue-600', icon: 'text-blue-500' },
        green: { border: 'border-green-500', text: 'text-green-600', icon: 'text-green-500' },
        yellow: { border: 'border-yellow-500', text: 'text-yellow-600', icon: 'text-yellow-500' },
    };
    return colorMap[color] || colorMap.blue;
};
```

**Penjelasan:**
- **Function**: Mengembalikan object dengan CSS classes berdasarkan color
- **Color Map**: Object mapping color name ke Tailwind classes
- **Fallback**: `|| colorMap.blue` jika color tidak ditemukan

---

### 3.3 Render Stats Cards dengan .map()

```jsx
return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsConfig.map((stat, index) => {
            const colors = getColorClasses(stat.color);
            const Icon = stat.icon;
            
            return (
                <div key={index} className={`bg-white p-6 rounded-xl border-l-4 ${colors.border}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className={`text-xs ${colors.text}`}>{stat.subtitle}</p>
                        </div>
                        <Icon className={`w-8 h-8 ${colors.icon}`} />
                    </div>
                </div>
            );
        })}
    </div>
);
```

**Penjelasan:**
- **`.map()`**: Loop array untuk render multiple cards
- **`key={index}`**: Unique key untuk React (required untuk list)
- **Dynamic Icon**: `const Icon = stat.icon` lalu render sebagai `<Icon />`
- **Template Literals**: Menggunakan backticks untuk string interpolation
- **Responsive Grid**: 
  - 1 kolom di mobile
  - 2 kolom di tablet (md)
  - 3 kolom di desktop (lg)

---

## 4. KOMPONEN CHART (`Chart.jsx`)

### 4.1 Data Visualization

```jsx
import { Line } from 'react-chartjs-2';

const Chart = ({ meetings }) => {
    const chartData = {
        labels: meetings.labels || [],
        datasets: [{
            label: 'Jumlah Pertemuan',
            data: meetings.data || [],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
        }]
    };

    return <Line data={chartData} options={chartOptions} />;
};
```

**Penjelasan:**
- **Chart.js**: Library untuk data visualization
- **Data Structure**: 
  - `labels`: Labels untuk x-axis (tanggal, bulan, dll)
  - `datasets`: Array of data series
    - `label`: Nama data series
    - `data`: Array of values untuk y-axis
- **Styling**: Border color dan background color untuk visualisasi

---

## 5. KOMPONEN MENTOR SESSIONS TABLE

### 5.1 Table dengan Data Mapping

```jsx
const MentorSessionsTable = ({ mentors }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Sesi Mentor Terbaru</h3>
            <table className="w-full">
                <thead>
                    <tr>
                        <th>Nama Mentor</th>
                        <th>Tanggal</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {mentors.map((mentor) => (
                        <tr key={mentor.id}>
                            <td>{mentor.name}</td>
                            <td>{mentor.date}</td>
                            <td>{mentor.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
```

**Penjelasan:**
- **Table Structure**: Standard HTML table dengan styling Tailwind
- **`.map()` untuk rows**: Loop data mentors untuk generate table rows
- **Key prop**: `key={mentor.id}` untuk React optimization

---

## 6. KOMPONEN RECENT REVIEWS

### 6.1 Display Latest Reviews

```jsx
const RecentReviews = ({ reviews }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Review Terbaru</h3>
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                        <div className="flex items-center justify-between">
                            <p className="font-medium">{review.mentor_name}</p>
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
```

**Penjelasan:**
- **Space-y-4**: Vertical spacing antara items
- **Border-b**: Bottom border untuk separator
- **StarRating**: Komponen reusable untuk menampilkan rating bintang

---

## 7. ALUR KERJA DASHBOARD

### Flowchart Logic:

```
1. User login berhasil → Redirect ke Dashboard
   ↓
2. Backend: Fetch data (stats, meetings, mentors, reviews)
   ↓
3. Backend: Kirim data ke front-end via Inertia.js props
   ↓
4. Front-end: Render komponen-komponen dashboard
   ↓
5. useEffect: Set up real-time clock (update setiap detik)
   ↓
6. Komponen-komponen render data:
   - StatsCards: Tampilkan statistik
   - Chart: Render grafik pertemuan
   - Tables: Tampilkan data tabular
   ↓
7. User Interaction:
   - Refresh button → Reload halaman
   - Sidebar navigation → Navigate ke halaman lain
   - Theme toggle → Switch light/dark mode
```

---

## 8. KEUNGGULAN DESAIN

1. **Component-Based Architecture**: 
   - Setiap bagian dashboard adalah komponen terpisah
   - Mudah di-maintain dan di-reuse

2. **Responsive Design**:
   - Grid layout adaptif untuk berbagai screen size
   - Mobile-first approach

3. **Real-time Updates**:
   - Clock update setiap detik
   - Data bisa di-refresh secara manual

4. **Performance Optimization**:
   - Lazy loading untuk komponen besar
   - Memoization untuk expensive calculations

5. **User Experience**:
   - Loading states untuk feedback
   - Error handling yang graceful
   - Dark mode support

---

## 9. KESIMPULAN

Modul Dashboard menggunakan:
- **Component Composition**: Membangun UI dari komponen-komponen kecil
- **React Hooks**: useState dan useEffect untuk state management
- **Context API**: Theme dan notification management
- **Data Visualization**: Chart.js untuk grafik
- **Responsive Layout**: Grid system untuk adaptif design

Modul ini memberikan overview sistem yang komprehensif dengan UI yang modern dan user-friendly.




