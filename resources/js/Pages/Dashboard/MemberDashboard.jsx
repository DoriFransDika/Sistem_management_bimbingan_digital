import React from 'react';
import { Head } from '@inertiajs/react';
import MemberSidebar from '../../Components/Member/MemberSidebar';
import MemberHeader from '../../Components/Member/MemberHeader';
import MemberStats from '../../Components/Member/MemberStats';
import NearestSchedule from '../../Components/Member/NearestSchedule';
import LastReview from '../../Components/Member/LastReview';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { NotificationProvider } from '../../Contexts/NotificationContext';

const MemberDashboard = ({ auth, memberData, memberStats, nearestSchedule, lastReview }) => {
    return (
        <ThemeProvider>
            <NotificationProvider>
                <Head title="Dashboard Member" />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
                    {/* Sidebar */}
                    <MemberSidebar 
                        auth={auth}
                        activeMenu="HALAMAN UTAMA"
                    />
                    
                    {/* Main Content */}
                    <div className="px-14 py-10 flex-1 flex flex-col">
                        {/* Header */}
                        <MemberHeader 
                            title="Dashboard MEMBER"
                            subtitle={`Selamat Datang Kembali, ${memberData?.name || auth.user.name} 😊`}
                            memberName={memberData?.name || auth.user.name}
                        />
                        
                        {/* Dashboard Content */}
                        <div className="flex-1 p-6">
                            <div className="max-w-7xl mx-auto">
                                {/* Member Stats */}
                                <div className="mb-8">
                                    <MemberStats stats={memberStats} />
                                </div>

                                {/* Two Column Layout */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Nearest Schedule */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                            Jadwal Terdekat
                                        </h2>
                                        <NearestSchedule schedule={nearestSchedule} />
                                    </div>

                                    {/* Last Review */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                            Ulasan Terakhir Anda
                                        </h2>
                                        <LastReview review={lastReview} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </NotificationProvider>
        </ThemeProvider>
    );
};

export default MemberDashboard;
