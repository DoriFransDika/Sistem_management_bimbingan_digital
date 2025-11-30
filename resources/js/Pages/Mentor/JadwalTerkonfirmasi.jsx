import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MentorSidebar from '../../Components/Mentor/MentorSidebar';
import MentorHeader from '../../Components/Mentor/MentorHeader';
import RequestCard from '../../Components/Mentor/RequestCard';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { NotificationProvider } from '../../Contexts/NotificationContext';
import { Search, CheckCircle, Calendar, Clock } from 'lucide-react';

const JadwalTerkonfirmasi = ({ auth, schedules }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSchedules = schedules.filter(schedule => 
        schedule.member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.training_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ThemeProvider>
            <NotificationProvider>
                <Head title="Jadwal Terkonfirmasi" />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
                    {/* Sidebar */}
                    <MentorSidebar 
                        auth={auth}
                        activeMenu="Jadwal Terkonfirmasi"
                    />
                    
                    {/* Main Content */}
                    <div className="px-14 py-10 flex-1 flex flex-col">
                        {/* Header */}
                        <MentorHeader 
                            title="JADWAL TERKONFIRMASI"
                            subtitle="Kelola jadwal yang sudah dikonfirmasi"
                        />
                        
                        {/* Action Bar */}
                        <div className="flex items-center justify-between mb-6">
                            {/* Search Bar */}
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Cari jadwal..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center space-x-4 ml-6">
                                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {schedules.length} Jadwal Terkonfirmasi
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Schedules Grid */}
                        <div className="flex-1">
                            {filteredSchedules.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredSchedules.map((schedule) => (
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
                                        <Calendar className="w-16 h-16 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        {searchTerm ? 'Tidak Ada Hasil Pencarian' : 'Tidak Ada Jadwal Terkonfirmasi'}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {searchTerm 
                                            ? 'Coba gunakan kata kunci lain'
                                            : 'Belum ada jadwal yang sudah dikonfirmasi'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </NotificationProvider>
        </ThemeProvider>
    );
};

export default JadwalTerkonfirmasi;


