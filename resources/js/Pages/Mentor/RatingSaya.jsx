import React from 'react';
import { Head } from '@inertiajs/react';
import MentorSidebar from '../../Components/Mentor/MentorSidebar';
import MentorHeader from '../../Components/Mentor/MentorHeader';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { NotificationProvider } from '../../Contexts/NotificationContext';
import { Star, User, Calendar, MessageCircle } from 'lucide-react';

const RatingSaya = ({ auth, ratings = [], stats }) => {
    const average = stats?.average || 0;
    const count = stats?.count || 0;

    const renderStars = (value) => {
        const full = Math.round(value);
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < full ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
            />
        ));
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <ThemeProvider>
            <NotificationProvider>
                <Head title="Rating Saya" />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
                    <MentorSidebar auth={auth} activeMenu="Rating Saya" />

                    <div className="px-14 py-10 flex-1 flex flex-col">
                        <MentorHeader
                            title="RATING SAYA"
                            subtitle="Lihat penilaian dan ulasan dari para member"
                        />

                        <div className="flex-1">
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                Rating Rata-rata
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                    {average.toFixed(1)}
                                                </span>
                                                <div className="flex items-center">
                                                    {renderStars(average)}
                                                </div>
                                            </div>
                                        </div>
                                        <Star className="w-10 h-10 text-yellow-400" />
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Total Ulasan
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                            {count}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* List Ratings */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                {ratings.length === 0 ? (
                                    <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                                        Belum ada rating dari member.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {ratings.map((rating) => (
                                            <div key={rating.id} className="p-6 flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                                    {rating.member_name ? rating.member_name.charAt(0).toUpperCase() : 'M'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <User className="w-4 h-4 text-gray-500" />
                                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                                    {rating.member_name || 'Member'}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                                                                {rating.member_email}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="flex items-center">
                                                                {renderStars(rating.rating)}
                                                            </div>
                                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                {Number(rating.rating).toFixed(1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        <span>{formatDate(rating.created_at)}</span>
                                                    </div>
                                                    {rating.review && (
                                                        <div className="mt-1 flex items-start gap-2">
                                                            <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                {rating.review}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </NotificationProvider>
        </ThemeProvider>
    );
};

export default RatingSaya;



