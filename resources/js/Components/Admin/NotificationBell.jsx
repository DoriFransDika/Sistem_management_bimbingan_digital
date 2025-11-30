import React from 'react';
import { Bell } from 'lucide-react';
import { useNotification } from '../../Contexts/NotificationContext';

const NotificationBell = () => {
    const { unreadCount, toggleNotification } = useNotification();

    return (
        <button
            onClick={toggleNotification}
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </button>
    );
};

export default NotificationBell;

