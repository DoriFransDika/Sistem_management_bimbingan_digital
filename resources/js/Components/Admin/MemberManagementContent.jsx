// Components/Admin/MemberManagementContent.jsx
import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Briefcase, Edit2, Trash2, X, User, Mail, Phone, Calendar, Lock, Users } from 'lucide-react';
import axios from 'axios';

// Komponen Card Member yang Enhanced
const MemberCard = ({ member, onViewDetail, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                            {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{member.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{member.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{member.phone || 'No phone'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            member.meetingType === 'Daring' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-green-100 text-green-700'
                        }`}>
                            {member.meetingType}
                        </span>
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">
                            {member.remainingSessions} sesi tersisa
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-2">
                <button
                    onClick={() => onViewDetail(member)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                >
                    <Eye className="w-4 h-4" />
                    Detail
                </button>
                <button
                    onClick={() => onEdit(member)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(member)}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="mt-2 text-sm text-gray-600 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" /> {/* Contoh ikon dari lucide-react */}
                    <span>{member.trainingType}</span>
                </div>
        </div>
    );
};

// Komponen Pagination yang Enhanced
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    if (totalPages <= 1) return null;
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    // Show only 3 pages around current page
    const getVisiblePages = () => {
        const pages = [];
        const maxVisible = 3;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 2) {
                for (let i = 1; i <= 3; i++) {
                    pages.push(i);
                }
            } else if (currentPage >= totalPages - 1) {
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
            }
        }
        
        return pages;
    };

    return (
        <div className="flex justify-between items-center mt-8">
            <div className="text-sm text-gray-600">
                Menampilkan {startItem} sampai {endItem} dari {totalItems} hasil
            </div>
            
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    &lt;
                </button>
                
                {getVisiblePages().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all ${
                            currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

const MemberDetailModal = ({ member, isOpen, onClose }) => {
    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 relative">
                    <button onClick={onClose} className="absolute right-4 top-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors" > 
                        <X className="w-6 h-6" /> 
                    </button>
                    <div className="flex items-center">
                        <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                            {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{member.name}</h2>
                            <p className="text-blue-100">Detail Member</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Blok Email */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <Mail className="w-5 h-5 text-blue-500 mr-2" />
                                <span className="font-medium text-gray-700">Email</span>
                            </div>
                            <p className="text-gray-900">{member.email}</p>
                        </div>
                        
                        {/* Blok Telepon */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <Phone className="w-5 h-5 text-green-500 mr-2" />
                                <span className="font-medium text-gray-700">Telepon</span>
                            </div>
                            <p className="text-gray-900">{member.phone || 'Tidak ada'}</p>
                        </div>

                        {/* Blok Sisa Sesi */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <Calendar className="w-5 h-5 text-orange-500 mr-2" />
                                <span className="font-medium text-gray-700">Sisa Sesi</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{member.remainingSessions}</p>
                        </div>
                        
                        {/* Blok Jenis Pertemuan */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <Users className="w-5 h-5 text-purple-500 mr-2" />
                                <span className="font-medium text-gray-700">Jenis Pertemuan</span>
                            </div>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                member.meetingType === 'Daring' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {member.meetingType}
                            </span>
                        </div>
                        
                        {/* Blok Jenis Pelatihan */}
                        <div className="bg-gray-50 rounded-lg p-4 col-span-1 md:col-span-2">
                            <div className="flex items-center mb-2">
                                <Briefcase className="w-5 h-5 text-indigo-500 mr-2" />
                                <span className="font-medium text-gray-700">Jenis Pelatihan</span>
                            </div>
                            <p className="text-gray-900">{member.trainingType || 'Belum diatur'}</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <button onClick={onClose} className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal Add/Edit Member yang Enhanced
const MemberFormModal = ({ isOpen, onClose, onSave, member = null, isEdit = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        meetingType: 'Daring',
        sessions: 8,
        password: '',
        trainingType: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit && member) {
            setFormData({
                name: member.name,
                email: member.email,
                phone: member.phone || '',
                meetingType: member.meetingType,
                sessions: member.remainingSessions,
                password: '',
                trainingType: member.trainingType || ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                meetingType: 'Daring',
                sessions: 8,
                password: '',
                trainingType: ''
            });
        }
        setErrors({});
    }, [isEdit, member, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            let response;
            if (isEdit) {
                response = await axios.put(route('admin.members.update', member.id), formData);
            } else {
                response = await axios.post(route('admin.members.store'), formData);
            }
            
            onSave(response.data.member);
            onClose();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                alert(`Gagal ${isEdit ? 'memperbarui' : 'menambah'} member. Silakan coba lagi.`);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <h3 className="text-xl font-bold flex items-center">
                        {isEdit ? <Edit2 className="w-6 h-6 mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
                        {isEdit ? 'Edit Member' : 'Tambah Member Baru'}
                    </h3>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Nama *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Masukkan nama lengkap"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                    </div>
                    
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="contoh@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                    </div>
                    
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Lock className="w-4 h-4 mr-2" />
                            Password {isEdit ? '(kosongkan jika tidak ingin mengubah)' : '*'}
                        </label>
                        <input
                            type="password"
                            required={!isEdit}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Masukkan password"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                    </div>
                    
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            Telepon
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            placeholder="08123456789"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Users className="w-4 h-4 mr-2" /> {/* Ganti ikon jika perlu */}
                            Jenis Pelatihan *
                        </label>
                        <select
                            value={formData.trainingType}
                            onChange={(e) => setFormData({...formData, trainingType: e.target.value})}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            <option value="" disabled>Pilih Jenis Pelatihan</option>
                            <option value="Administrasi Perkantoran">Administrasi Perkantoran</option>
                            <option value="Graphic Design">Graphic Design</option>
                            <option value="Web Programming Basic">Web Programming Basic</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                        </select>
                        {errors.trainingType && <p className="text-red-500 text-xs mt-1">{errors.trainingType[0]}</p>}
                    </div>
                    
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Jenis Pertemuan *
                        </label>
                        <select
                            value={formData.meetingType}
                            onChange={(e) => setFormData({...formData, meetingType: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            <option value="Daring">Daring (Online)</option>
                            <option value="Luring">Luring (Offline)</option>
                        </select>
                        {errors.meetingType && <p className="text-red-500 text-xs mt-1">{errors.meetingType[0]}</p>}
                    </div>
                    
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Jumlah Sesi *
                        </label>
                        <input
                            type="number"
                            min="1"
                            required
                            value={formData.sessions}
                            onChange={(e) => setFormData({...formData, sessions: parseInt(e.target.value)})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                        {errors.sessions && <p className="text-red-500 text-xs mt-1">{errors.sessions[0]}</p>}
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : (isEdit ? 'Perbarui' : 'Tambah')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal Delete Confirmation yang Enhanced
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, memberName, loading }) => {
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
                        Apakah Anda yakin ingin menghapus member:
                    </p>
                    <p className="font-bold text-gray-900 text-lg mb-4">"{memberName}"?</p>
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



// Main Component
export default function MemberManagementContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterTraining, setFilterTraining] = useState('');
    const [filterMeeting, setFilterMeeting] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const fetchMembers = async () => {
        try {
            const response = await axios.get(route('admin.members.data'), {
                params: {
                    search: searchTerm,
                    page: currentPage,
                    training_type: filterTraining,
                    meeting_type: filterMeeting,
                }
            });
            setMembers(response.data.data);
            setTotalPages(response.data.last_page);
            setTotalItems(response.data.total);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    // useEffect untuk me-reset halaman saat filter atau search berubah
    useEffect(() => {
        const handler = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                fetchMembers();
            }
        }, 300); // Debounce 300ms
        
        return () => clearTimeout(handler);
    }, [searchTerm, filterTraining, filterMeeting]);

    // useEffect untuk fetch data saat halaman berubah
    useEffect(() => {
        fetchMembers();
    }, [currentPage]);

    const handleAddMember = () => {
        setIsEdit(false);
        setSelectedMember(null);
        setShowFormModal(true);
    };

    const handleEditMember = (member) => {
        setIsEdit(true);
        setSelectedMember(member);
        setShowFormModal(true);
    };

    const handleDeleteMember = (member) => {
        setSelectedMember(member);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setDeleteLoading(true);
        try {
            await axios.delete(route('admin.members.destroy', selectedMember.id));
            fetchMembers();
            setShowDeleteModal(false);
            setSelectedMember(null);
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Gagal menghapus member. Silakan coba lagi.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleViewDetail = (member) => {
        setSelectedMember(member);
        setShowDetailModal(true);
    };

    const handleFormSave = () => {
        fetchMembers();
        setShowFormModal(false);
    };

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
    
        {/* Grup untuk Search dan Filter */}
        <div className="flex items-center gap-4 flex-grow">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-sm">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Cari member..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Filter Jenis Pelatihan */}
            <select 
                value={filterTraining}
                onChange={(e) => setFilterTraining(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Semua Pelatihan</option>
                <option value="Administrasi Perkantoran">Administrasi Perkantoran</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Web Programming Basic">Web Programming Basic</option>
                <option value="UI/UX Design">UI/UX Design</option>
            </select>

            {/* Filter Jenis Pertemuan */}
            <select 
                value={filterMeeting}
                onChange={(e) => setFilterMeeting(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Semua Pertemuan</option>
                <option value="Daring">Daring</option>
                <option value="Luring">Luring</option>
            </select>
        </div>
        
        {/* Tombol Tambah Member (sekarang terpisah) */}
        <button
            onClick={handleAddMember}
            className="ml-auto px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
        >
            <Plus className="w-5 h-5" />
            Tambah Member Baru
        </button>
    </div>

            {members.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">Tidak ada member ditemukan</h3>
                    <p className="text-gray-400">Mulai dengan menambah member baru</p>
                </div>
            ) : (
                <div className="bg-slate-100 rounded-xl shadow-lg border border-gray-300 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-blue-100 border-b border-gray-300">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">NAMA</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">JENIS PELATIHAN</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">JENIS PERTEMUAN</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SISA PERTEMUAN</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {members.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                    
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{member.trainingType || 'Belum diatur'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                                                member.meetingType === 'Daring' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-purple-100 text-purple-700'
                                            }`}>
                                                {member.meetingType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{member.remainingSessions} sesi tersisa</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleViewDetail(member)}
                                                    className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    Lihat Detail
                                                </button>
                                                <button
                                                    onClick={() => handleEditMember(member)}
                                                    className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteMember(member)}
                                                    className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={10}
            />

            {/* Modals */}
            <MemberFormModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                onSave={handleFormSave}
                member={selectedMember}
                isEdit={isEdit}
            />

            <MemberDetailModal
                member={selectedMember}
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                memberName={selectedMember?.name}
                loading={deleteLoading}
            />
        </>
    );
}