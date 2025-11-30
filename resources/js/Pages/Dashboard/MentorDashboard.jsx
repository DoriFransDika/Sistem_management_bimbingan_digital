import React from 'react';
import { Head } from '@inertiajs/react';
import MentorSidebar from '../../Components/Mentor/MentorSidebar';
import MentorHeader from '../../Components/Mentor/MentorHeader';
import PerformanceSummary from '../../Components/Mentor/PerformanceSummary';
import UpcomingSchedule from '../../Components/Mentor/UpcomingSchedule';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { NotificationProvider } from '../../Contexts/NotificationContext';

const MentorDashboard = ({ auth, mentorData, upcomingSchedules, performanceStats }) => {
    return (
        <ThemeProvider>
            <NotificationProvider>
                <Head title="Dashboard Mentor" />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
                    {/* Sidebar */}
                    <MentorSidebar 
                        auth={auth}
                        activeMenu="DASHBOARD"
                    />
                    
                    {/* Main Content */}
                    <div className="flex-1 flex flex-col px-14 py-5">
                        {/* Header */}
                        <MentorHeader 
                            title="MENTOR DASHBOARD"
                            subtitle="Selamat Datang Di Pusat Kendali Mentor"
                        />
                        
                        {/* Dashboard Content */}
                        <div className="flex-1 ">
                            <div className="max-w-7xl mx-auto">

                                {/* Performance Summary */}
                                <div className="mb-8">
                                    <PerformanceSummary stats={performanceStats} />
                                </div>

                                {/* Upcoming Schedule */}
                                <div>
                                    <div className=" p-10 flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Jadwal Terkonfirmasi Mendatang
                                        </h2>
                                        <a 
                                            href="#" 
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                                        >
                                            Lihat Semua
                                        </a>
                                    </div>
                                    <UpcomingSchedule schedules={upcomingSchedules} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </NotificationProvider>
        </ThemeProvider>
    );
};

export default MentorDashboard;
