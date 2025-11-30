import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MemberSidebar from '../../Components/Member/MemberSidebar';
import MemberHeader from '../../Components/Member/MemberHeader';
import ScheduleCard from '../../Components/Member/ScheduleCard';
import AddScheduleModal from '../../Components/Member/AddScheduleModal';
import ScheduleDetailModal from '../../Components/Member/ScheduleDetailModal';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { NotificationProvider } from '../../Contexts/NotificationContext';
import { Search, Plus, Calendar } from 'lucide-react';
import { router } from '@inertiajs/react';

const JadwalMember = ({ auth, schedules, mentors, memberProfile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [trainingFilter, setTrainingFilter] = useState('Semua Pelatihan');
    const [meetingFilter, setMeetingFilter] = useState('Semua Pertemuan');


    const filteredSchedules = schedules.filter(schedule => {
        const matchesSearch = schedule.mentor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            schedule.training_type?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesTraining = trainingFilter === 'Semua Pelatihan' || 
                                schedule.training_type === trainingFilter;
        
        const matchesMeeting = meetingFilter === 'Semua Pertemuan' || 
                            (meetingFilter === 'Luring' && memberProfile?.meeting_type === 'Luring') ||
                            (meetingFilter === 'Daring' && memberProfile?.meeting_type === 'Daring');

        return matchesSearch && matchesTraining && matchesMeeting;
    });

    const trainingTypes = ['Semua Pelatihan', 'Administrasi Perkantoran', 'Graphic Design', 'Web Programming Basic', 'UI/UX Design'];
    const meetingTypes = ['Semua Pertemuan', 'Luring', 'Daring'];

    const handleDetailClick = (schedule) => {
        setSelectedSchedule(schedule);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedSchedule(null);
    };

    return (
        <ThemeProvider>
            <NotificationProvider>
                <Head title="Jadwal Member" />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
                    {/* Sidebar */}
                    <MemberSidebar 
                        auth={auth}
                        activeMenu="Jadwal"
                    />
                    
                    {/* Main Content */}
                    <div className="px-14 py-10 flex-1 flex flex-col">
                        {/* Header */}
                        <MemberHeader 
                            title="MANAJEMEN JADWAL"
                            subtitle="Pusat Manajemen Jadwal Digital"
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

                            {/* Filters */}
                            <div className="flex items-center space-x-4 ml-6">
                                <select
                                    value={trainingFilter}
                                    onChange={(e) => setTrainingFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    {trainingTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>

                                <select
                                    value={meetingFilter}
                                    onChange={(e) => setMeetingFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    {meetingTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Jadwal Baru</span>
                            </button>
                        </div>

                        {/* Schedules Grid */}
                        <div className="flex-1">
                            {filteredSchedules.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredSchedules.map((schedule) => (
                                                <ScheduleCard
                                                    key={schedule.id}
                                                    schedule={schedule}
                                                    memberProfile={memberProfile}
                                                    onDetailClick={handleDetailClick}
                                                />
                                            ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                                        <Calendar className="w-16 h-16 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Belum Ada Jadwal
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        Mulai dengan menambahkan jadwal baru untuk pertemuan dengan mentor
                                    </p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        Tambah Jadwal Pertama
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add Schedule Modal */}
                <AddScheduleModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    mentors={mentors}
                    memberProfile={memberProfile}
                />

                {/* Schedule Detail Modal */}
                <ScheduleDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                    schedule={selectedSchedule}
                    memberProfile={memberProfile}
                />
            </NotificationProvider>
        </ThemeProvider>
    );
};

export default JadwalMember;
