import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import MentorSidebar from '../../Components/Mentor/MentorSidebar';
import MentorHeader from '../../Components/Mentor/MentorHeader';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { 
    Calendar, 
    Clock, 
    User, 
    CheckCircle, 
    FileText,
    Send,
    X,
    Upload,
    Link
} from 'lucide-react';

export default function LaporanMentor({ auth, schedules, materiByModul }) {
    const [showLaporanModal, setShowLaporanModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [laporanForm, setLaporanForm] = useState({
        materi_modul: '',
        materi_topik: '',
        materi_sub_topik: '',
        dokumentasi: ''
    });
    const [availableTopik, setAvailableTopik] = useState([]);
    const [availableSubTopik, setAvailableSubTopik] = useState([]);

    // Map training types from schedules to materi modul names if they differ
    const modulAliasMap = {
        'Graphic Design': 'Desain Grafis',
        'Web Programming Basic': 'Pemrograman Web Dasar'
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

    const openLaporanModal = (schedule) => {
        setSelectedSchedule(schedule);

        // Determine modul from schedule training_type, applying alias mapping
        const rawModul = schedule?.training_type || '';
        const resolvedModul = modulAliasMap[rawModul] || rawModul;

        // Precompute available topics for this modul
        const topik = materiByModul[resolvedModul]
            ? materiByModul[resolvedModul]
                .map(item => item.topik)
                .filter((value, index, self) => self.indexOf(value) === index)
            : [];

        setLaporanForm({
            materi_modul: resolvedModul,
            materi_topik: '',
            materi_sub_topik: '',
            dokumentasi: ''
        });
        setAvailableTopik(topik);
        setAvailableSubTopik([]);
        setShowLaporanModal(true);
    };

    const handleModulChange = (modul) => {
        setLaporanForm({
            ...laporanForm,
            materi_modul: modul,
            materi_topik: '',
            materi_sub_topik: ''
        });
        
        // Get topik for selected modul
        const topik = materiByModul[modul]?.map(item => item.topik).filter((value, index, self) => self.indexOf(value) === index) || [];
        setAvailableTopik(topik);
        setAvailableSubTopik([]);
    };

    const handleTopikChange = (topik) => {
        setLaporanForm({
            ...laporanForm,
            materi_topik: topik,
            materi_sub_topik: ''
        });
        
        // Get sub-topik for selected topik
        const subTopik = materiByModul[laporanForm.materi_modul]
            ?.filter(item => item.topik === topik)
            ?.map(item => item.sub_topik) || [];
        setAvailableSubTopik(subTopik);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!laporanForm.materi_modul || !laporanForm.materi_topik || !laporanForm.materi_sub_topik) {
            alert('Harap lengkapi semua field materi');
            return;
        }

        router.post('/mentor/laporan', {
            schedule_id: selectedSchedule.id,
            ...laporanForm
        }, {
            onSuccess: () => {
                setShowLaporanModal(false);
                setSelectedSchedule(null);
            }
        });
    };

    return (
        <ThemeProvider >
            <Head title="Kirim Laporan" />
            <div className="flex h-screen bg-gray-50">
                <MentorSidebar auth={auth} activeMenu="Kirim Laporan" />
                
                <div className="flex-1 flex flex-col overflow-hidden px-14 py-10">
                    <MentorHeader title="Kirim Laporan" subtitle="Kirim laporan untuk pertemuan yang sudah selesai" />
                    
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                        {/* Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Pertemuan Selesai</p>
                                        <p className="text-2xl font-bold text-gray-900">{schedules.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <FileText className="w-8 h-8 text-blue-500 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Sudah Dilaporkan</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {schedules.filter(s => s.laporan_dikirim_at).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <Send className="w-8 h-8 text-orange-500 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Belum Dilaporkan</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {schedules.filter(s => !s.laporan_dikirim_at).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedules List */}
                        <div className="space-y-6">
                            {schedules.length === 0 ? (
                                <div className="text-center py-12">
                                    <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pertemuan selesai</h3>
                                    <p className="text-gray-500">Pertemuan yang sudah selesai akan muncul di sini.</p>
                                </div>
                            ) : (
                                schedules.map((schedule) => (
                                    <div key={schedule.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center mb-3">
                                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                            Selesai
                                                        </span>
                                                        {schedule.laporan_dikirim_at && (
                                                            <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                                Sudah Dilaporkan
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                        {schedule.training_type}
                                                    </h3>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <User className="w-4 h-4 mr-2" />
                                                            <span>Member: {schedule.member.name}</span>
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
                                                            <span>Email: {schedule.member.email}</span>
                                                        </div>
                                                    </div>

                                                    {schedule.laporan_dikirim_at && (
                                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                            <p className="text-sm text-blue-800">
                                                                <strong>Materi yang diajarkan:</strong> {schedule.materi_modul} - {schedule.materi_topik}
                                                            </p>
                                                            <p className="text-sm text-blue-800 mt-1">
                                                                <strong>Sub-topik:</strong> {schedule.materi_sub_topik}
                                                            </p>
                                                            <p className="text-sm text-blue-800 mt-1">
                                                                <strong>Laporan dikirim:</strong> {new Date(schedule.laporan_dikirim_at).toLocaleString('id-ID')}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="ml-6">
                                                    {!schedule.laporan_dikirim_at ? (
                                                        <button
                                                            onClick={() => openLaporanModal(schedule)}
                                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                                        >
                                                            <Send className="w-4 h-4 mr-2" />
                                                            Kirim Laporan
                                                        </button>
                                                    ) : (
                                                        <div className="text-center">
                                                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                                            <p className="text-sm text-green-600 font-medium">Sudah Dilaporkan</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Laporan Modal */}
            {showLaporanModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Kirim Laporan Pertemuan
                                </h3>
                                <button
                                    onClick={() => setShowLaporanModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            {/* Schedule Info (Read Only) */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Informasi Pertemuan</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Member:</span> {selectedSchedule?.member.name}
                                    </div>
                                    <div>
                                        <span className="font-medium">Email:</span> {selectedSchedule?.member.email}
                                    </div>
                                    <div>
                                        <span className="font-medium">Jenis Pelatihan:</span> {selectedSchedule?.training_type}
                                    </div>
                                    <div>
                                        <span className="font-medium">Tanggal:</span> {selectedSchedule && formatDate(selectedSchedule.proposed_date)}
                                    </div>
                                    <div>
                                        <span className="font-medium">Waktu:</span> {selectedSchedule && formatTime(selectedSchedule.proposed_time)}
                                    </div>
                                </div>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                {/* Materi Selection */
                                }
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-4">Materi yang Diajarkan</h4>
                                    
                                    {/* Modul Display (locked from schedule) */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Modul
                                        </label>
                                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                                            {laporanForm.materi_modul || '-'}
                                        </div>
                                    </div>

                                    {/* Topik Selection */}
                                    {laporanForm.materi_modul && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Topik *
                                            </label>
                                            <select
                                                value={laporanForm.materi_topik}
                                                onChange={(e) => handleTopikChange(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="">Pilih Topik</option>
                                                {availableTopik.map(topik => (
                                                    <option key={topik} value={topik}>{topik}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Sub-Topik Selection */}
                                    {laporanForm.materi_topik && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Sub-Topik *
                                            </label>
                                            <select
                                                value={laporanForm.materi_sub_topik}
                                                onChange={(e) => setLaporanForm({...laporanForm, materi_sub_topik: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="">Pilih Sub-Topik</option>
                                                {availableSubTopik.map(subTopik => (
                                                    <option key={subTopik} value={subTopik}>{subTopik}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Dokumentasi */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dokumentasi (Link atau Deskripsi)
                                    </label>
                                    <textarea
                                        value={laporanForm.dokumentasi}
                                        onChange={(e) => setLaporanForm({...laporanForm, dokumentasi: e.target.value})}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Masukkan link foto, file, atau deskripsi dokumentasi..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Bisa berupa link Google Drive, Dropbox, atau deskripsi dokumentasi
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowLaporanModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Send className="w-4 h-4 mr-2 inline" />
                                        Kirim Laporan
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

