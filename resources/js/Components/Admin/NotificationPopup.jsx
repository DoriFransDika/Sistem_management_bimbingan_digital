import React from 'react';
import { Bell, X, Check, Clock, User, FileText, Calendar, AlertCircle } from 'lucide-react';
import { useNotification } from '../../Contexts/NotificationContext';

const NotificationPopup = () => {
    const {
        notifications,
        unreadCount,
        isLoading,
        isOpen,
        markAsRead,
        markAllAsRead,
        closeNotification
    } = useNotification();

    if (!isOpen) return null;

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'schedule_confirmed':
                return <Calendar className="w-5 h-5 text-green-500" />;
            case 'report_approved':
                return <FileText className="w-5 h-5 text-blue-500" />;
            case 'user_added':
                return <User className="w-5 h-5 text-purple-500" />;
            case 'meeting_created':
                return <Clock className="w-5 h-5 text-orange-500" />;
            case 'meeting_cancelled':
                return <X className="w-5 h-5 text-red-500" />;
            case 'report_rejected':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const formatTimeAgo = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffInMinutes = Math.floor((now - created) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Baru saja';
        if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} hari yang lalu`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-25"
                onClick={closeNotification}
            />
            
            {/* Notification Panel */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Notifikasi
                        </h3>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Tandai semua dibaca
                            </button>
                        )}
                        <button
                            onClick={closeNotification}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[60vh]">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
                            <Bell className="w-12 h-12 mb-2 opacity-50" />
                            <p>Tidak ada notifikasi</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                                        !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatTimeAgo(notification.created_at)}
                                                </span>
                                                {!notification.is_read && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button 
                            onClick={() => {
                                window.location.href = route('admin.notifications.index');
                            }}
                            className="w-full text-center text-sm text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Lihat Semua Notifikasi →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPopup;
