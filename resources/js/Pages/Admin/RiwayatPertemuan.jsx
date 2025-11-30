import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Sidebar from '../../Components/Admin/Sidebar';
import Header from '../../Components/Admin/Header';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { NotificationProvider } from '../../Contexts/NotificationContext';
import NotificationPopup from '../../Components/Admin/NotificationPopup';
import { Calendar, Filter, Users, BookOpen } from 'lucide-react';
import axios from 'axios';

export default function RiwayatPertemuan({ auth, trainingTypes = [] }) {
    const [records, setRecords] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedTrainingType, setSelectedTrainingType] = useState('');
    const [perPage, setPerPage] = useState(10);

    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(route('admin.riwayat.data'), {
                params: {
                    page,
                    training_type: selectedTrainingType,
                    per_page: perPage,
                }
            });
            setRecords(res.data.data || []);
            setPagination(res.data.pagination || {});
        } catch (e) {
            console.error('Failed to load history data', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1);
    }, [selectedTrainingType, perPage]);

    const pageTitle = 'Riwayat Pertemuan';
    const pageSubtitle = 'Data pertemuan selesai dengan filter jenis pelatihan';

    return (
        <ThemeProvider>
            <NotificationProvider>
                <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                    <Head title={pageTitle} />
                    <Sidebar auth={auth} activeMenu="Riwayat Pertemuan" />

                    <div className="flex-1 flex flex-col overflow-hidden">
                        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
                            <Header title={pageTitle} subtitle={pageSubtitle} />

                        {/* Filters */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                            <div className="flex flex-col md:flex-row md:items-end gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jenis Pelatihan</label>
                                    <div className="relative">
                                        <select
                                            value={selectedTrainingType}
                                            onChange={(e) => setSelectedTrainingType(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="">Semua</option>
                                            {trainingTypes.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                        <Filter className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Per halaman</label>
                                    <select
                                        value={perPage}
                                        onChange={(e) => setPerPage(parseInt(e.target.value, 10))}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Member</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mentor</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jenis Pelatihan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Topik</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sub Topik</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pertemuan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {loading ? (
                                            <tr>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300" colSpan="7">Memuat...</td>
                                            </tr>
                                        ) : records.length === 0 ? (
                                            <tr>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300" colSpan="7">Tidak ada data</td>
                                            </tr>
                                        ) : (
                                            records.map((row) => (
                                                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2"><Users className="w-4 h-4" /> {row.member_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.mentor_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2"><Calendar className="w-4 h-4" /> {row.proposed_date} {row.proposed_time ? `(${row.proposed_time})` : ''}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.training_type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.materi_topik || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.materi_sub_topik || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2"><BookOpen className="w-4 h-4" /> {row.pertemuan ?? '-'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    Total: {pagination.total || 0}
                                </div>
                                <div className="space-x-2">
                                    <button
                                        disabled={!pagination.current_page || pagination.current_page <= 1}
                                        onClick={() => fetchData((pagination.current_page || 1) - 1)}
                                        className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        disabled={!pagination.current_page || pagination.current_page >= (pagination.last_page || 1)}
                                        onClick={() => fetchData((pagination.current_page || 1) + 1)}
                                        className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                        </main>
                    </div>

                    {/* Notification Popup */}
                    <NotificationPopup />
                </div>
            </NotificationProvider>
        </ThemeProvider>
    );
}


