import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MentorSidebar from '../../Components/Mentor/MentorSidebar';
import MentorHeader from '../../Components/Mentor/MentorHeader';
import RequestCard from '../../Components/Mentor/RequestCard';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { NotificationProvider } from '../../Contexts/NotificationContext';
import { Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const PermintaanMasuk = ({ auth, pendingRequests, confirmedSchedules }) => {
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPendingRequests = pendingRequests.filter(request => 
        request.member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.training_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredConfirmedSchedules = confirmedSchedules.filter(schedule => 
        schedule.member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.training_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ThemeProvider>
            <NotificationProvider>
                <Head title="Permintaan Masuk" />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
                    {/* Sidebar */}
                    <MentorSidebar 
                        auth={auth}
                        activeMenu="Permintaan Masuk"
                    />
                    
                    {/* Main Content */}
                    <div className="px-14 py-10 flex-1 flex flex-col">
                        {/* Header */}
                        <MentorHeader 
                            title="PERMINTAAN MASUK"
                            subtitle="Kelola Permintaan Jadwal dari Member"
                        />
                        
                        {/* Action Bar */}
                        <div className="flex items-center justify-between mb-6">
                            {/* Search Bar */}
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Cari permintaan..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center space-x-4 ml-6">
                                <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {pendingRequests.length} Menunggu
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {confirmedSchedules.length} Dikonfirmasi
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    activeTab === 'pending'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Menunggu Konfirmasi ({pendingRequests.length})</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('confirmed')}
                                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    activeTab === 'confirmed'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Jadwal Terkonfirmasi ({confirmedSchedules.length})</span>
                                </div>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            {activeTab === 'pending' ? (
                                <div>
                                    {filteredPendingRequests.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredPendingRequests.map((request) => (
                                                <RequestCard
                                                    key={request.id}
                                                    request={request}
                                                    type="pending"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="text-gray-400 dark:text-gray-500 mb-4">
                                                <Clock className="w-16 h-16 mx-auto" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                Tidak Ada Permintaan
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Belum ada permintaan jadwal yang menunggu konfirmasi
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {filteredConfirmedSchedules.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredConfirmedSchedules.map((schedule) => (
                                                <RequestCard
                                                    key={schedule.id}
                                                    request={schedule}
                                                    type="confirmed"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="text-gray-400 dark:text-gray-500 mb-4">
                                                <CheckCircle className="w-16 h-16 mx-auto" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                Tidak Ada Jadwal Terkonfirmasi
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Belum ada jadwal yang sudah dikonfirmasi
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </NotificationProvider>
        </ThemeProvider>
    );
};

export default PermintaanMasuk;




















