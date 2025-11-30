import React, { useState, useEffect } from 'react';
import { Star, Search, Plus, Eye, Edit2, Trash2, X, User, Mail, Phone, Briefcase, Lock, Calendar} from 'lucide-react';
import axios from 'axios';

// ===================================================================
// Komponen Card Mentor
// ===================================================================
const MentorCard = ({ mentor, onViewDetail, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <div className="bg-gradient-to-br from-indigo-500 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                            {mentor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{mentor.name}</h3>
                            <p className="text-gray-600 text-sm">{mentor.email}</p>
                        </div>
                    </div>

                    {/* ====== TAMBAHKAN BLOK RATING DI SINI ====== */}
                    <div className="flex items-center gap-2 my-3">
                        <StarRating rating={mentor.average_rating} />
                        <span className="text-sm text-gray-600 font-medium">
                            {mentor.average_rating}
                            <span className="text-gray-400 ml-1">({mentor.ratings_count})</span>
                        </span>
                    </div>

                    {/* ====== TAMBAHKAN BLOK JUMLAH AJAR ====== */}
                    <div className="flex items-center gap-2 my-3">
                        <div className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                            {mentor.completed_meetings_count || 0} pertemuan selesai
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 space-y-2 mt-3">
                        <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{mentor.phone || 'No phone'}</span>
                        </div>
                        <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-2" />
                    <div className="flex flex-wrap gap-1">
                        {mentor.specializations && mentor.specializations.length > 0 ? (
                            mentor.specializations.map((spec, index) => (
                                <span key={index} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">{spec}</span>
                            ))
                        ) : (
                            <span className="text-gray-400 text-xs">N/A</span>
                        )}
                    </div>
                        </div>
                    </div>
                </div>
            </div>

            
            
            <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                    onClick={() => onViewDetail(mentor)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                >
                    <Eye className="w-4 h-4" />
                    Detail
                </button>
                <button
                    onClick={() => onEdit(mentor)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(mentor)}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>

        
    );
};

// ===================================================================
// Komponen Reusable untuk Menampilkan Bintang Rating
// ===================================================================
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

// ===================================================================
// Komponen Modal Detail Mentor (Desain Baru yang Konsisten)
// ===================================================================
const MentorDetailModal = ({ mentor, isOpen, onClose }) => {
    if (!isOpen || !mentor) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                
                {/* ====== Header Modal ====== */}
                <div className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center">
                        <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                            {mentor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{mentor.name}</h2>
                            <p className="text-teal-100">Detail Mentor</p>
                        </div>
                        
                    </div>
                    
                </div>
                
                
                {/* ====== Konten Detail ====== */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                {/* ====== BLOK RATING DENGAN POSISI TENGAH ====== */}
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2 flex flex-col items-center"> {/* <-- KELAS DITAMBAHKAN DI SINI */}
                    <div className="flex items-center mb-2">
                        <Star className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="font-medium text-gray-700">Penilaian</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-4xl mt-2 p-2 font-bold text-gray-900">{mentor.average_rating}</p>
                        <div>
                            <StarRating rating={mentor.average_rating} />
                            <p className="text-sm text-gray-500 mt-1">
                                Berdasarkan {mentor.ratings_count} ulasan
                            </p>
                        </div>
                    </div>
                </div>
                        
                        {/* --- Blok Email --- */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <Mail className="w-5 h-5 text-blue-500 mr-2" />
                                <span className="font-medium text-gray-700">Email</span>
                            </div>
                            <p className="text-gray-900 break-words">{mentor.email}</p>
                        </div>
                        
                        {/* --- Blok Telepon --- */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <Phone className="w-5 h-5 text-green-500 mr-2" />
                                <span className="font-medium text-gray-700">Telepon</span>
                            </div>
                            <p className="text-gray-900">{mentor.phone || 'Tidak diatur'}</p>
                        </div>
                        
                        {/* --- Blok Spesialisasi --- */}
                        <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                            <div className="flex items-center mb-2">
                                <Briefcase className="w-5 h-5 text-indigo-500 mr-2" />
                                <span className="font-medium text-gray-700">Spesialisasi</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {mentor.specializations && mentor.specializations.length > 0 ? (
                                    mentor.specializations.map((spec, index) => (
                                        <span key={index} className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full font-medium">
                                            {spec}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">Belum ada spesialisasi</p>
                                )}
                            </div>
                        </div>

                        {/* --- Blok Hari Tersedia --- */}
                        <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                            <div className="flex items-center mb-2">
                                <Calendar className="w-5 h-5 text-orange-500 mr-2" />
                                <span className="font-medium text-gray-700">Hari Tersedia</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {mentor.available_days && mentor.available_days.length > 0 ? (
                                    mentor.available_days.map((day, index) => (
                                        <span key={index} className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full font-medium">
                                            {day}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">Belum mengatur hari</p>
                                )}
                            </div>
                        </div>

                        {/* --- Blok Total Pertemuan --- */}
                        <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                            <div className="flex items-center mb-2">
                                <Calendar className="w-5 h-5 text-green-500 mr-2" />
                                <span className="font-medium text-gray-700">Total Pertemuan</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 text-green-700 text-2xl font-bold px-4 py-2 rounded-lg">
                                    {mentor.completed_meetings_count || 0}
                                </div>
                                <span className="text-gray-600 text-sm">pertemuan selesai</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ====== Footer dengan Tombol Tutup ====== */}
                <div className="flex justify-end p-6 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

// ===================================================================
// Komponen Modal Form Mentor (Add/Edit)
// ===================================================================
const MentorFormModal = ({ isOpen, onClose, onSave, mentor = null, isEdit = false ,specializations = [], availableDays = []}) => {
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

        useEffect(() => {
            if (isOpen) {
                if (isEdit && mentor) {
                    // Mengisi form untuk mode EDIT
                    setFormData({
                        name: mentor.name,
                        email: mentor.email,
                        phone: mentor.phone || '',
                        password: '',
                        specialization_ids: mentor.specialization_ids || [], 
                        day_ids: mentor.day_ids || [],
                    });
                } else {
                    // Mereset form untuk mode TAMBAH BARU
                    setFormData({
                        name: '', email: '', phone: '', password: '',
                        specialization_ids: [],
                        day_ids: [],
                    });
                }
                setErrors({});
            }
        }, [isOpen, isEdit, mentor]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            let response;
            if (isEdit) {
                response = await axios.put(`/admin/mentors/${mentor.id}`, formData);
            } else {
                response = await axios.post('/admin/mentors', formData);
            }
            onSave(response.data);
            onClose();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                alert(`Gagal ${isEdit ? 'memperbarui' : 'menambah'} mentor. Silakan coba lagi.`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (field, value) => {
        setFormData(prev => {
            const currentArray = prev[field];
            if (currentArray.includes(value)) {
                // Hapus dari array
                return { ...prev, [field]: currentArray.filter(item => item !== value) };
            } else {
                // Tambahkan ke array
                return { ...prev, [field]: [...currentArray, value] };
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] shadow-2xl flex flex-col">
                <div className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white p-6 relative">
                    <button type="button" onClick={onClose} className="absolute right-4 top-4 text-white hover:bg-white/20 rounded-full p-2">
                        <X className="w-6 h-6" />
                    </button>
                    <h3 className="text-xl font-bold">{isEdit ? 'Edit Mentor' : 'Tambah Mentor Baru'}</h3>
                </div>

                <div className="h-max p-6 space-y-4 overflow-y-auto flex-grow">
                    {/* Input untuk Nama, Email, Password, Phone */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 flex items-center mb-2"><User className="w-4 h-4 mr-2" />Nama *</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border rounded-lg" required />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 flex items-center mb-2"><Mail className="w-4 h-4 mr-2" />Email *</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border rounded-lg" required />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 flex items-center mb-2"><Lock className="w-4 h-4 mr-2" />Password {isEdit ? '(Biarkan kosong jika tidak diubah)' : '*'}</label>
                        <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 border rounded-lg" required={!isEdit} />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 flex items-center mb-2"><Phone className="w-4 h-4 mr-2" />Telepon</label>
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>}
                    </div>

                    {/* Input untuk Spesialisasi */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Spesialisasi *
                        </label>
                        <div className="flex flex-wrap gap-3 p-3 bg-gray-50 border rounded-lg">
                            {specializations.map(spec => (
                                <div key={spec.Id_specializations} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`spec-${spec.Id_specializations}`}
                                        value={spec.Id_specializations}
                                        checked={formData.specialization_ids.includes(spec.Id_specializations)}
                                        onChange={() => handleCheckboxChange('specialization_ids', spec.Id_specializations)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`spec-${spec.Id_specializations}`} className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        {spec.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.specialization_ids && (
                            <p className="text-red-500 text-xs mt-1">{errors.specialization_ids[0]}</p>
                        )}
                    </div>

                    {/* Input untuk Hari Tersedia */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                            <Calendar className="w-4 h-4 mr-2" />
                            Hari Tersedia *
                        </label>
                        <div className="flex flex-wrap gap-3 p-3 bg-gray-50 border rounded-lg">
                            {availableDays.map(day => (
                                <div key={day.Id_day} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`day-${day.Id_day}`}
                                        value={day.Id_day}
                                        checked={formData.day_ids.includes(day.Id_day)}
                                        onChange={() => handleCheckboxChange('day_ids', day.Id_day)}
                                        className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                    />
                                    <label htmlFor={`day-${day.Id_day}`} className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        {day.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.day_ids && (
                            <p className="text-red-500 text-xs mt-1">{errors.day_ids[0]}</p>
                        )}
                    </div>
                </div>

                

                
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-gray-700 border rounded-lg hover:bg-gray-50" disabled={loading}>Batal</button>
                    <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-lg disabled:opacity-50">
                        {loading ? 'Menyimpan...' : (isEdit ? 'Perbarui' : 'Tambah')}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Modal Delete Confirmation yang Enhanced
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, mentorName, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl">
                    <h3 className="text-xl font-bold flex items-center">
                        <Trash2 className="w-6 h-6 mr-2" />
                        Konfirmasi Hapus
                    </h3>
                </div>
                
                <div className="p-6">
                    <p className="text-gray-700 mb-2">
                        Apakah Anda yakin ingin menghapus mentor:
                    </p>
                    <p className="font-bold text-gray-900 text-lg mb-4">"{mentorName}"?</p>
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        ⚠️ Tindakan ini tidak dapat dibatalkan!
                    </p>
                    
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium disabled:opacity-50"
                        >
                            {loading ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ===================================================================
// Komponen Utama
// ===================================================================
export default function MentorManagementContent({ specializations, availableDays }) {
    // Debug logging
    console.log('MentorManagementContent - specializations:', specializations);
    console.log('MentorManagementContent - availableDays:', availableDays);
    
    // PERUBAHAN: Semua state diubah dari "member" ke "mentor"
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

    // PERUBAHAN: Endpoint API diubah ke route mentor
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
            console.error('Error response:', error.response?.data);
            setMentors([]);
            setTotalPages(0);
        }
    };

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

    const handleAddMentor = () => {
        setIsEdit(false);
        setSelectedMentor(null);
        setShowFormModal(true);
    };

    const handleEditMentor = async (mentor) => {
        setIsEdit(true);
        try {
            // Fetch detailed mentor data for editing
            const response = await axios.get(`/admin/mentors/${mentor.id}`);
            setSelectedMentor(response.data);
            setShowFormModal(true);
        } catch (error) {
            console.error('Error fetching mentor details:', error);
            alert('Gagal memuat data mentor untuk diedit.');
        }
    };

    const handleDeleteMentor = (mentor) => {
        setSelectedMentor(mentor);
        setShowDeleteModal(true);
    };
    
    const handleViewDetail = (mentor) => {
        setSelectedMentor(mentor);
        setShowDetailModal(true);
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

    const handleFormSave = () => {
        fetchMentors(); // Refresh data
    };

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="Cari mentor berdasarkan nama atau email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border rounded-xl"/>
                </div>
                 {/* ====== Area Filter (TAMBAHKAN INI) ====== */}
                <div className="flex items-center gap-4">
                    {/* Filter Spesialisasi */}
                    <select 
                        value={filterSpecialization}
                        onChange={(e) => setFilterSpecialization(e.target.value)}
                        className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Semua Spesialisasi</option>
                        {specializations.map(spec => (
                            <option key={spec.Id_specializations} value={spec.Id_specializations}>{spec.name}</option>
                        ))}
                    </select>

                    {/* Filter Hari */}
                    <select 
                        value={filterDay}
                        onChange={(e) => setFilterDay(e.target.value)}
                        className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Semua Hari</option>
                        {availableDays.map(day => (
                            <option key={day.Id_day} value={day.Id_day}>{day.name}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleAddMentor} className="ml-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-xl font-medium flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Tambah Mentor
                </button>
            </div>

            {mentors.length === 0 ? (
                <div className="text-center py-12"><p>Tidak ada mentor ditemukan.</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mentors.map((mentor) => (
                        <MentorCard
                            key={mentor.id}
                            mentor={mentor}
                            onViewDetail={handleViewDetail}
                            onEdit={handleEditMentor}
                            onDelete={handleDeleteMentor}
                        />
                    ))}
                </div>
            )}
            
            {/* ... Komponen Pagination dan Modal Delete ... */}

            <MentorFormModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                onSave={handleFormSave}
                mentor={selectedMentor}
                isEdit={isEdit}
                specializations={specializations}
                availableDays={availableDays}
            />
            <MentorDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                mentor={selectedMentor}
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                mentorName={selectedMentor?.name}
                loading={deleteLoading}
            />
        </>
    );
}