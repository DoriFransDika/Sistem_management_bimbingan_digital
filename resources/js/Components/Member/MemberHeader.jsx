import React, { useState, useEffect } from 'react';
import { RefreshCw, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../Contexts/ThemeContext';

export default function MemberHeader({ currentTime, loading, onRefresh, title, subtitle, memberName }) {
    const [time, setTime] = useState(currentTime || new Date());
    const { isDarkMode, toggleDarkMode } = useTheme();

    useEffect(() => {
        if (!currentTime) {
            const timer = setInterval(() => {
                setTime(new Date());
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [currentTime]);

    const displayTime = currentTime || time;

    const formatTime = (time) => {
        return time.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Default values untuk Member Dashboard
    const pageTitle = title || "Dashboard MEMBER";
    const pageSubtitle = subtitle || "Selamat Datang Kembali, " + (memberName || 'Member') + " 😊";

    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{pageTitle}</h1>
                <p className="text-gray-600 dark:text-gray-300 text-2xl">{pageSubtitle}</p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                    Mari lanjutkan progres bimbinganmu hari ini.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {displayTime.toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })} - {formatTime(displayTime)}
                </p>
            </div>
            <div className="flex items-center space-x-4">
                {onRefresh && (
                    <button 
                        onClick={onRefresh}
                        disabled={loading}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                )}
                
                {/* Notification Bell */}
                <button
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 relative"
                    title="Notifikasi"
                >
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    {/* Notification badge */}
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">9+</span>
                </button>
                
                {/* Theme Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDarkMode ? (
                        <Sun className="w-5 h-5 text-yellow-500" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600" />
                    )}
                </button>
            </div>
        </div>
    );
};
