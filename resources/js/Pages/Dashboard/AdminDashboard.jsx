import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from "../../Components/Admin/Sidebar";
import Header from "../../Components/Admin/Header";
import StatsCards from "../../Components/Admin/StatsCards";
import Chart from "../../Components/Admin/Chart";
import MentorSessionsTable from "../../Components/Admin/MentorSessionsTable";
import RecentReviews from "../../Components/Admin/RecentReviews";
import MentorRatings from "../../Components/Admin/MentorRatings";
import NotificationPopup from "../../Components/Admin/NotificationPopup";
import { ThemeProvider } from "../../Contexts/ThemeContext";
import { NotificationProvider } from "../../Contexts/NotificationContext";


export default function Dashboard({ auth, stats = {}, meetings = {}, mentors = [], reviews = [], mentorRatings = [] }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            window.location.reload();
        } catch (error) {
            console.error('Error refreshing:', error);
        } finally {
            setLoading(false);
        }
    };

    // Use props data with fallback
    const currentStats = {
        totalMember: 0,
        totalMentor: 0,
        verifikasiMentor: 0,
        ...stats
    };

    return (
        <ThemeProvider>
            <NotificationProvider>
                <Head title="Admin Dashboard" />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
                    {/* Sidebar */}
                    <Sidebar auth={auth} />

                    {/* Main Content */}
                    <div className="flex-1 p-8">
                        {/* Header */}
                        <Header 
                            currentTime={currentTime}
                            loading={loading}
                            onRefresh={handleRefresh}
                        />

                        {/* Stats Cards */}
                        <StatsCards stats={currentStats} />

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Chart Section */}
                            <div className="lg:col-span-1">
                                <Chart meetings={meetings} />
                            </div>

                            {/* Mentor Sessions Table */}
                            <div className="lg:col-span-1">
                                <MentorSessionsTable mentors={mentors} />
                            </div>
                        </div>

                        {/* Reviews and Ratings Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                            {/* Recent Reviews */}
                            <RecentReviews reviews={reviews} />
                            
                            {/* Mentor Ratings */}
                            <MentorRatings mentors={mentorRatings} />
                        </div>
                    </div>

                    {/* Notification Popup */}
                    <NotificationPopup />
                </div>
            </NotificationProvider>
        </ThemeProvider>
    );
}