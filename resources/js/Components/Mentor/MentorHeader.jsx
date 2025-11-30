import React, { useState, useEffect } from 'react';
import { RefreshCw, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../Contexts/ThemeContext';

export default function MentorHeader({ currentTime, loading, onRefresh, title, subtitle }) {
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

    // Default values untuk Mentor Dashboard
    const pageTitle = title || "MENTOR DASHBOARD";
    const pageSubtitle = subtitle || "Selamat Datang Di Pusat Kendali Mentor";

    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{pageTitle}</h1>
                <p className="text-gray-600 dark:text-gray-300 text-2xl">{pageSubtitle}</p>
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

