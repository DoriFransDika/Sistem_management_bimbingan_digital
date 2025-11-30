# MODUL MANAGEMENT MENTOR
## Front-End Logic Script & Penjelasan

---

## 1. OVERVIEW MODUL MANAGEMENT MENTOR

Modul Management Mentor adalah sistem untuk mengelola data mentor dalam aplikasi. Modul ini menyediakan fungsi CRUD (Create, Read, Update, Delete) untuk mengelola informasi mentor, termasuk spesialisasi dan hari tersedia.

---

## 2. FILE UTAMA: `MentorManagement.jsx`

### 2.1 Import Dependencies

```jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '../../Components/Admin/Sidebar';
import Header from '../../Components/Admin/Header';
import MentorManagementContent from '../../Components/Admin/MentorManagementContent';
import NotificationPopup from '../../Components/Admin/NotificationPopup';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { NotificationProvider } from '../../Contexts/NotificationContext';
```

**Penjelasan:**
- **Layout Components**: `Sidebar` dan `Header` untuk konsistensi UI
- **Main Content**: `MentorManagementContent` - komponen utama yang berisi logic CRUD
- **Context Providers**: Theme dan Notification untuk global state management

---

### 2.2 Props dari Backend

```jsx
export default function MentorManagement({ auth, specializations, availableDays }) {
```

**Penjelasan:**
- **`auth`**: Data user yang sedang login (untuk authorization)
- **`specializations`**: Array data spesialisasi mentor (contoh: Web Development, Data Science)
- **`availableDays`**: Array data hari tersedia (contoh: Senin, Selasa, dll)
- Data ini diperlukan untuk dropdown/form di modal tambah/edit mentor

---

### 2.3 Layout Structure

```jsx
return (
    <ThemeProvider>
        <NotificationProvider>
            <div className="flex h-screen bg-gray-50">
                <Sidebar auth={auth} activeMenu="Manajemen Mentor" />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto p-8">
                        <Header title="Manajemen Mentor" />
                        <MentorManagementContent 
                            specializations={specializations}
                            availableDays={availableDays}
                        />
                    </main>
                </div>
            </div>
        </NotificationProvider>
    </ThemeProvider>
);
```

**Penjelasan:**
- **Context Providers**: Wrap seluruh aplikasi untuk akses theme/notification
- **Layout Flexbox**: Sidebar + Content area
- **`overflow-y-auto`**: Enable scroll jika konten panjang
- **Props Forwarding**: Data dari backend diteruskan ke komponen content

---

## 3. KOMPONEN UTAMA: `MentorManagementContent.jsx`

### 3.1 State Management dengan useState

```jsx
const [searchTerm, setSearchTerm] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [showFormModal, setShowFormModal] = useState(false);
const [showDetailModal, setShowDetailModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [mentors, setMentors] = useState([]);
const [totalPages, setTotalPages] = useState(0);
const [selectedMentor, setSelectedMentor] = useState(null);
const [isEdit, setIsEdit] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(false);
const [filterSpecialization, setFilterSpecialization] = useState('');
const [filterDay, setFilterDay] = useState('');
```

**Penjelasan:**
- **Search & Filter States**:
  - `searchTerm`: Keyword untuk pencarian mentor
  - `filterSpecialization`: Filter berdasarkan spesialisasi
  - `filterDay`: Filter berdasarkan hari tersedia
  
- **Pagination States**:
  - `currentPage`: Halaman saat ini
  - `totalPages`: Total halaman
  
- **Modal States**:
  - `showFormModal`: Toggle modal form (tambah/edit)
  - `showDetailModal`: Toggle modal detail mentor
  - `showDeleteModal`: Toggle modal konfirmasi delete
  
- **Data States**:
  - `mentors`: Array data mentor
  - `selectedMentor`: Mentor yang dipilih untuk edit/view/delete
  
- **Mode States**:
  - `isEdit`: Boolean untuk menentukan mode form (tambah/edit)
  
- **Loading States**:
  - `deleteLoading`: Loading state saat proses delete

---

### 3.2 Function Fetch Data dari API

```jsx
const fetchMentors = async () => {
    try {
        const response = await axios.get('/admin/mentors/data', {
            params: { 
                search: searchTerm, 
                page: currentPage,
                specialization_id: filterSpecialization,
                day: filterDay,
            }
        });
        setMentors(response.data.data);
        setTotalPages(response.data.last_page);
    } catch (error) {
        console.error('Error fetching mentors:', error);
        setMentors([]);
        setTotalPages(0);
    }
};
```

**Penjelasan:**
- **`async/await`**: Syntax untuk handle asynchronous operations
- **`axios.get()`**: HTTP GET request ke backend API
- **Query Parameters**:
  - `search`: Keyword pencarian
  - `page`: Halaman untuk pagination
  - `specialization_id`: Filter spesialisasi
  - `day`: Filter hari
- **Response Handling**:
  - `response.data.data`: Array mentor dari Laravel pagination
  - `response.data.last_page`: Total halaman
- **Error Handling**: 
  - `try-catch` untuk handle error
  - Set empty array jika error

---

### 3.3 useEffect untuk Auto-fetch Data

```jsx
useEffect(() => {
    if (currentPage !== 1) {
        setCurrentPage(1);
    } else {
        fetchMentors();
    }
}, [searchTerm, filterSpecialization, filterDay]);

useEffect(() => {
    fetchMentors();
}, [currentPage]);
```

**Penjelasan:**
- **useEffect #1**: Trigger saat search/filter berubah
  - Reset ke halaman 1 jika bukan halaman 1
  - Fetch data baru dengan parameter baru
  
- **useEffect #2**: Trigger saat halaman berubah
  - Fetch data untuk halaman yang dipilih
  
- **Dependency Array**: 
  - Array kosong `[]` = hanya jalan sekali saat mount
  - Array berisi dependencies = jalan saat dependencies berubah

---

### 3.4 Handler Functions - Add Mentor

```jsx
const handleAddMentor = () => {
    setIsEdit(false);
    setSelectedMentor(null);
    setShowFormModal(true);
};
```

**Penjelasan:**
- **Set Mode**: `setIsEdit(false)` = mode tambah baru
- **Reset Selection**: `setSelectedMentor(null)` = tidak ada mentor terpilih
- **Open Modal**: `setShowFormModal(true)` = tampilkan modal form

---

### 3.5 Handler Functions - Edit Mentor

```jsx
const handleEditMentor = async (mentor) => {
    setIsEdit(true);
    try {
        const response = await axios.get(`/admin/mentors/${mentor.id}`);
        setSelectedMentor(response.data);
        setShowFormModal(true);
    } catch (error) {
        console.error('Error fetching mentor details:', error);
        alert('Gagal memuat data mentor untuk diedit.');
    }
};
```

**Penjelasan:**
- **Set Mode**: `setIsEdit(true)` = mode edit
- **Fetch Detail**: GET request untuk data lengkap mentor (termasuk relationships)
- **Set Selected**: Set mentor yang akan diedit
- **Open Modal**: Tampilkan modal form dengan data terisi
- **Error Handling**: Alert jika gagal fetch data

---

### 3.6 Handler Functions - Delete Mentor

```jsx
const handleDeleteMentor = (mentor) => {
    setSelectedMentor(mentor);
    setShowDeleteModal(true);
};

const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
        await axios.delete(`/admin/mentors/${selectedMentor.id}`);
        fetchMentors(); // Refresh data
        setShowDeleteModal(false);
    } catch (error) {
        alert('Gagal menghapus mentor.');
    } finally {
        setDeleteLoading(false);
    }
};
```

**Penjelasan:**
- **Two-step Delete**: 
  1. `handleDeleteMentor`: Set selected mentor dan tampilkan konfirmasi
  2. `confirmDelete`: Proses delete setelah konfirmasi
  
- **Loading State**: Set loading sebelum delete
- **Refresh Data**: `fetchMentors()` untuk update list setelah delete
- **Error Handling**: Alert jika gagal

---

### 3.7 Handler Functions - View Detail

```jsx
const handleViewDetail = (mentor) => {
    setSelectedMentor(mentor);
    setShowDetailModal(true);
};
```

**Penjelasan:**
- **Set Selected**: Set mentor yang akan dilihat
- **Open Modal**: Tampilkan modal detail (read-only)

---

## 4. KOMPONEN MENTOR CARD (`MentorCard`)

### 4.1 Display Mentor Information

```jsx
const MentorCard = ({ mentor, onViewDetail, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Avatar */}
            <div className="bg-gradient-to-br from-indigo-500 to-teal-500 w-12 h-12 rounded-full">
                {mentor.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Info */}
            <h3>{mentor.name}</h3>
            <p>{mentor.email}</p>
            
            {/* Rating */}
            <StarRating rating={mentor.average_rating} />
            
            {/* Actions */}
            <button onClick={() => onViewDetail(mentor)}>Detail</button>
            <button onClick={() => onEdit(mentor)}>Edit</button>
            <button onClick={() => onDelete(mentor)}>Delete</button>
        </div>
    );
};
```

**Penjelasan:**
- **Props**: Menerima mentor data dan handler functions
- **Avatar**: Inisial nama di circle dengan gradient background
- **Display Info**: Nama, email, rating
- **Action Buttons**: 
  - Callback functions dengan mentor sebagai parameter
  - `onClick={() => onViewDetail(mentor)}` - Pass mentor ke handler

---

### 4.2 Star Rating Component

```jsx
const StarRating = ({ rating = 0 }) => {
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    
    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, index) => (
                <Star
                    key={index}
                    className={`w-5 h-5 ${
                        index < fullStars
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 fill-gray-300'
                    }`}
                />
            ))}
        </div>
    );
};
```

**Penjelasan:**
- **`[...Array(totalStars)]`**: Membuat array dengan 5 elemen
- **`.map()`**: Loop untuk render setiap bintang
- **Conditional Styling**: 
  - Jika `index < fullStars`: Yellow (terisi)
  - Jika tidak: Gray (kosong)
- **`Math.floor(rating)`**: Convert rating (contoh: 4.5) ke integer (4)

---

## 5. KOMPONEN MODAL FORM (`MentorFormModal`)

### 5.1 State Management untuk Form

```jsx
const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specialization_ids: [], 
    day_ids: [],
});
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});
```

**Penjelasan:**
- **`formData`**: Object untuk menyimpan semua field form
- **`specialization_ids`**: Array ID spesialisasi yang dipilih
- **`day_ids`**: Array ID hari tersedia yang dipilih
- **`errors`**: Object untuk menyimpan validation errors

---

### 5.2 useEffect untuk Pre-fill Form (Edit Mode)

```jsx
useEffect(() => {
    if (isOpen) {
        if (isEdit && mentor) {
            // Mode EDIT: Isi form dengan data mentor
            setFormData({
                name: mentor.name,
                email: mentor.email,
                phone: mentor.phone || '',
                password: '', // Kosongkan password
                specialization_ids: mentor.specialization_ids || [], 
                day_ids: mentor.day_ids || [],
            });
        } else {
            // Mode TAMBAH: Reset form
            setFormData({
                name: '', email: '', phone: '', password: '',
                specialization_ids: [], day_ids: [],
            });
        }
        setErrors({}); // Reset errors
    }
}, [isOpen, isEdit, mentor]);
```

**Penjelasan:**
- **Trigger**: Jalan saat modal dibuka (`isOpen = true`)
- **Conditional Logic**:
  - **Edit Mode**: Pre-fill dengan data mentor
  - **Add Mode**: Reset ke empty values
- **Password**: Selalu kosong di edit mode (opsional update)
- **Reset Errors**: Clear validation errors saat modal dibuka

---

### 5.3 Form Submission Handler

```jsx
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
        let response;
        if (isEdit) {
            // PUT request untuk update
            response = await axios.put(`/admin/mentors/${mentor.id}`, formData);
        } else {
            // POST request untuk create
            response = await axios.post('/admin/mentors', formData);
        }
        onSave(response.data); // Callback ke parent
        onClose(); // Tutup modal
    } catch (error) {
        if (error.response?.status === 422) {
            // Validation errors dari Laravel
            setErrors(error.response.data.errors || {});
        } else {
            alert(`Gagal ${isEdit ? 'memperbarui' : 'menambah'} mentor.`);
        }
    } finally {
        setLoading(false);
    }
};
```

**Penjelasan:**
- **`e.preventDefault()`**: Mencegah default form submission
- **Conditional Request**:
  - **PUT**: Update existing mentor
  - **POST**: Create new mentor
- **Error Handling**:
  - **422**: Validation errors (tampilkan di form)
  - **Other**: General error (alert)
- **Success**: 
  - Call `onSave()` untuk refresh data di parent
  - Close modal

---

### 5.4 Checkbox Handler untuk Multi-select

```jsx
const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
        const currentArray = prev[field];
        if (currentArray.includes(value)) {
            // Hapus dari array jika sudah ada
            return { ...prev, [field]: currentArray.filter(item => item !== value) };
        } else {
            // Tambahkan ke array jika belum ada
            return { ...prev, [field]: [...currentArray, value] };
        }
    });
};
```

**Penjelasan:**
- **Toggle Logic**: 
  - Jika value sudah ada → hapus
  - Jika value belum ada → tambah
- **Spread Operator**: 
  - `...prev`: Copy semua field form data
  - `[field]`: Dynamic field name (specialization_ids atau day_ids)
- **Array Methods**:
  - `.includes()`: Check apakah value ada
  - `.filter()`: Hapus value dari array
  - `[...currentArray, value]`: Tambah value ke array

---

### 5.5 Render Checkbox untuk Spesialisasi

```jsx
<div className="flex flex-wrap gap-3 p-3 bg-gray-50 border rounded-lg">
    {specializations.map(spec => (
        <div key={spec.Id_specializations} className="flex items-center">
            <input
                type="checkbox"
                id={`spec-${spec.Id_specializations}`}
                value={spec.Id_specializations}
                checked={formData.specialization_ids.includes(spec.Id_specializations)}
                onChange={() => handleCheckboxChange('specialization_ids', spec.Id_specializations)}
            />
            <label htmlFor={`spec-${spec.Id_specializations}`}>
                {spec.name}
            </label>
        </div>
    ))}
</div>
```

**Penjelasan:**
- **`.map()`**: Loop array specializations
- **Controlled Checkbox**:
  - `checked`: Boolean berdasarkan apakah ID ada di array
  - `onChange`: Call handler dengan field name dan value
- **`htmlFor`**: Connect label dengan input (accessibility)

---

## 6. KOMPONEN MODAL DETAIL (`MentorDetailModal`)

### 6.1 Display Mentor Information (Read-only)

```jsx
const MentorDetailModal = ({ mentor, isOpen, onClose }) => {
    if (!isOpen || !mentor) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60">
            <div className="bg-white rounded-2xl w-full max-w-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white p-6">
                    <h2>{mentor.name}</h2>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-600">Email</p>
                            <p>{mentor.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Phone</p>
                            <p>{mentor.phone || 'N/A'}</p>
                        </div>
                    </div>
                    
                    {/* Spesialisasi */}
                    <div>
                        <p className="text-gray-600">Spesialisasi</p>
                        <div className="flex flex-wrap gap-2">
                            {mentor.specializations?.map((spec, index) => (
                                <span key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="flex justify-end p-6">
                    <button onClick={onClose}>Tutup</button>
                </div>
            </div>
        </div>
    );
};
```

**Penjelasan:**
- **Conditional Render**: `if (!isOpen || !mentor) return null` - tidak render jika modal tertutup
- **Modal Overlay**: `fixed inset-0` untuk full-screen overlay
- **Grid Layout**: 2 kolom untuk informasi
- **Optional Chaining**: `mentor.specializations?.map()` - safe jika undefined
- **Badge Display**: Spesialisasi ditampilkan sebagai badges/chips

---

## 7. SEARCH & FILTER FUNCTIONALITY

### 7.1 Search Input

```jsx
<div className="relative flex-1 max-w-md">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2" />
    <input 
        type="text" 
        placeholder="Cari mentor..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
    />
</div>
```

**Penjelasan:**
- **Controlled Input**: `value` dan `onChange` terhubung dengan state
- **Debouncing**: Bisa ditambahkan untuk optimasi (delay sebelum fetch)
- **Icon Position**: Absolute positioning untuk search icon

---

### 7.2 Filter Dropdown

```jsx
<select 
    value={filterSpecialization}
    onChange={(e) => setFilterSpecialization(e.target.value)}
>
    <option value="">Semua Spesialisasi</option>
    {specializations.map(spec => (
        <option key={spec.Id_specializations} value={spec.Id_specializations}>
            {spec.name}
        </option>
    ))}
</select>
```

**Penjelasan:**
- **Default Option**: "Semua Spesialisasi" dengan value kosong
- **Dynamic Options**: Generate dari array specializations
- **Controlled Select**: Value terhubung dengan state

---

## 8. ALUR KERJA CRUD OPERATIONS

### 8.1 CREATE Flow

```
1. User klik "Tambah Mentor"
   ↓
2. handleAddMentor() → setIsEdit(false), setShowFormModal(true)
   ↓
3. Modal Form muncul (kosong)
   ↓
4. User isi form → formData state update
   ↓
5. User klik "Simpan"
   ↓
6. handleSubmit() → POST request ke /admin/mentors
   ↓
7. Backend: Validasi & save ke database
   ↓
8. Success → onSave() → fetchMentors() → Refresh list
   Error → setErrors() → Tampilkan error di form
```

### 8.2 READ Flow

```
1. Component mount → fetchMentors() → GET /admin/mentors/data
   ↓
2. Backend: Query dengan filter & pagination
   ↓
3. Response → setMentors() → Render MentorCard components
   ↓
4. User klik "Detail" → handleViewDetail() → Show modal detail
```

### 8.3 UPDATE Flow

```
1. User klik "Edit" pada card
   ↓
2. handleEditMentor() → GET /admin/mentors/{id} (fetch detail)
   ↓
3. Response → setSelectedMentor() → Pre-fill form
   ↓
4. Modal Form muncul (sudah terisi)
   ↓
5. User edit data → formData state update
   ↓
6. User klik "Update"
   ↓
7. handleSubmit() → PUT request ke /admin/mentors/{id}
   ↓
8. Success → Refresh list
```

### 8.4 DELETE Flow

```
1. User klik "Delete" pada card
   ↓
2. handleDeleteMentor() → setSelectedMentor(), setShowDeleteModal(true)
   ↓
3. Modal konfirmasi muncul
   ↓
4. User klik "Ya, Hapus"
   ↓
5. confirmDelete() → DELETE request ke /admin/mentors/{id}
   ↓
6. Backend: Delete dari database
   ↓
7. Success → fetchMentors() → Refresh list
```

---

## 9. VALIDATION & ERROR HANDLING

### 9.1 Front-end Validation (Optional)

```jsx
const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.name.trim()) {
        setErrors({ name: ['Nama wajib diisi'] });
        return;
    }
    
    if (!formData.email.includes('@')) {
        setErrors({ email: ['Email tidak valid'] });
        return;
    }
    
    // Continue with API request...
};
```

**Penjelasan:**
- **Early Return**: Stop submission jika validasi gagal
- **User Feedback**: Set error untuk ditampilkan di form

---

### 9.2 Backend Validation Errors

```jsx
catch (error) {
    if (error.response?.status === 422) {
        // Laravel validation errors
        // Format: { field: ['error message'], ... }
        setErrors(error.response.data.errors || {});
    }
}
```

**Penjelasan:**
- **422 Status**: Laravel validation error status code
- **Error Format**: Object dengan field name sebagai key
- **Display**: Loop errors untuk tampilkan di bawah input

---

## 10. KESIMPULAN

Modul Management Mentor menggunakan:
- **State Management**: Multiple useState untuk complex state
- **API Integration**: Axios untuk HTTP requests
- **CRUD Operations**: Create, Read, Update, Delete functionality
- **Modal Components**: Reusable modal untuk form dan detail
- **Search & Filter**: Real-time filtering dengan useEffect
- **Error Handling**: Comprehensive error handling
- **Form Validation**: Client-side dan server-side validation

Modul ini menyediakan interface yang user-friendly untuk mengelola data mentor dengan fitur lengkap CRUD, search, filter, dan pagination.




