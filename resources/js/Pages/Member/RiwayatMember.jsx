import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import MemberSidebar from '../../Components/Member/MemberSidebar';
import MemberHeader from '../../Components/Member/MemberHeader';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { 
    Calendar, 
    Clock, 
    User, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    Star,
    Filter,
    Search
} from 'lucide-react';

export default function RiwayatMember({ auth, schedules, ratings }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [ratingForm, setRatingForm] = useState({
        rating: 5,
        review: ''
    });

    // Filter schedules based on status and search term
    const filteredSchedules = schedules.filter(schedule => {
        const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
        const matchesSearch = searchTerm === '' || 
            schedule.mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.training_type.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Group schedules by status
    const groupedSchedules = {
        completed: filteredSchedules.filter(s => s.status === 'completed'),
        rejected: filteredSchedules.filter(s => s.status === 'rejected')
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Selesai';
            case 'rejected':
                return 'Ditolak';
            default:
                return status;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleRatingSubmit = (e) => {
        e.preventDefault();
        
        router.post('/member/riwayat/rating', {
            mentor_id: selectedSchedule.mentor_id,
            rating: ratingForm.rating,
            review: ratingForm.review
        }, {
            onSuccess: () => {
                setShowRatingModal(false);
                setSelectedSchedule(null);
                setRatingForm({ rating: 5, review: '' });
            }
        });
    };

    const openRatingModal = (schedule) => {
        setSelectedSchedule(schedule);
        setShowRatingModal(true);
    };

    const hasRated = (mentorId) => {
        return ratings.hasOwnProperty(mentorId);
    };

    const getExistingRating = (mentorId) => {
        return ratings[mentorId] || null;
    };

    return (
        <ThemeProvider>
            <Head title="Riwayat Jadwal" />
            <div className="flex h-screen bg-gray-50">
                <MemberSidebar auth={auth} activeMenu="Riwayat" />
                
                <div className="flex-1 flex flex-col overflow-hidden px-14 py-10">
                    <MemberHeader title="Riwayat Jadwal" subtitle="Lihat riwayat jadwal bimbingan Anda" />
                    
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                        {/* Filters and Search */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Cari berdasarkan mentor atau jenis pelatihan..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-gray-500" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="completed">Selesai</option>
                                        <option value="rejected">Ditolak</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Selesai</p>
                                        <p className="text-2xl font-bold text-gray-900">{groupedSchedules.completed.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <XCircle className="w-8 h-8 text-red-500 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Ditolak</p>
                                        <p className="text-2xl font-bold text-gray-900">{groupedSchedules.rejected.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedules List */}
                        <div className="space-y-6">
                            {filteredSchedules.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada riwayat jadwal</h3>
                                    <p className="text-gray-500">Belum ada jadwal yang masuk ke riwayat.</p>
                                </div>
                            ) : (
                                filteredSchedules.map((schedule) => {
                                    const existingRating = getExistingRating(schedule.mentor_id);
                                    
                                    return (
                                        <div key={schedule.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                                            <div className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-3">
                                                            {getStatusIcon(schedule.status)}
                                                            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.status)}`}>
                                                                {getStatusText(schedule.status)}
                                                            </span>
                                                        </div>
                                                        
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                            {schedule.training_type}
                                                        </h3>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                            <div className="flex items-center">
                                                                <User className="w-4 h-4 mr-2" />
                                                                <span>Mentor: {schedule.mentor.name}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Calendar className="w-4 h-4 mr-2" />
                                                                <span>{formatDate(schedule.proposed_date)}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Clock className="w-4 h-4 mr-2" />
                                                                <span>{formatTime(schedule.proposed_time)}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span>Email: {schedule.mentor.email}</span>
                                                            </div>
                                                        </div>

                                                        {schedule.rejection_reason && (
                                                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                                <p className="text-sm text-red-800">
                                                                    <strong>Alasan penolakan:</strong> {schedule.rejection_reason}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Materi Terakhir */}
                                                        {(schedule.materi_modul || schedule.materi_topik || schedule.materi_sub_topik) && (
                                                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                                <p className="text-sm font-medium text-blue-900 mb-2">
                                                                    Materi Terakhir:
                                                                </p>
                                                                {schedule.materi_modul && (
                                                                    <p className="text-sm text-blue-800">
                                                                        <strong>Modul:</strong> {schedule.materi_modul}
                                                                    </p>
                                                                )}
                                                                {schedule.materi_topik && (
                                                                    <p className="text-sm text-blue-800">
                                                                        <strong>Topik:</strong> {schedule.materi_topik}
                                                                    </p>
                                                                )}
                                                                {schedule.materi_sub_topik && (
                                                                    <p className="text-sm text-blue-800">
                                                                        <strong>Sub Topik:</strong> {schedule.materi_sub_topik}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Rating Section */}
                                                    <div className="ml-6">
                                                        {schedule.status === 'completed' && (
                                                            <div className="text-center">
                                                                {hasRated(schedule.mentor_id) ? (
                                                                    <div>
                                                                        <div className="flex items-center justify-center mb-2">
                                                                            {[...Array(5)].map((_, i) => (
                                                                                <Star
                                                                                    key={i}
                                                                                    className={`w-5 h-5 ${
                                                                                        i < existingRating.rating 
                                                                                            ? 'text-yellow-400 fill-current' 
                                                                                            : 'text-gray-300'
                                                                                    }`}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        <p className="text-sm text-gray-600">Sudah dinilai</p>
                                                                        {existingRating.review && (
                                                                            <p className="text-xs text-gray-500 mt-1 max-w-xs">
                                                                                "{existingRating.review}"
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => openRatingModal(schedule)}
                                                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                                                    >
                                                                        <Star className="w-4 h-4 mr-2" />
                                                                        Berikan Nilai
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Rating Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Berikan Rating untuk {selectedSchedule?.mentor.name}
                            </h3>
                            
                            <form onSubmit={handleRatingSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating (1-5)
                                    </label>
                                    <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                type="button"
                                                onClick={() => setRatingForm({...ratingForm, rating})}
                                                className={`w-8 h-8 rounded-full border-2 ${
                                                    rating <= ratingForm.rating
                                                        ? 'bg-yellow-400 border-yellow-400'
                                                        : 'bg-white border-gray-300'
                                                }`}
                                            >
                                                <Star className={`w-4 h-4 mx-auto ${
                                                    rating <= ratingForm.rating ? 'text-white' : 'text-gray-400'
                                                }`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Review (Opsional)
                                    </label>
                                    <textarea
                                        value={ratingForm.review}
                                        onChange={(e) => setRatingForm({...ratingForm, review: e.target.value})}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Bagikan pengalaman Anda..."
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowRatingModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Simpan Rating
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </ThemeProvider>
    );
}
