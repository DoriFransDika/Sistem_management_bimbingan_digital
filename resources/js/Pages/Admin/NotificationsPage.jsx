import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '../../Components/Admin/Sidebar';
import Header from '../../Components/Admin/Header';
import NotificationPopup from '../../Components/Admin/NotificationPopup';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { NotificationProvider } from '../../Contexts/NotificationContext';
import { Bell, Check, CheckCheck, Filter, Search, Calendar, FileText, User, Clock, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

const NotificationsPage = ({ auth, notifications: initialNotifications, pagination: initialPagination }) => {
    const [notifications, setNotifications] = useState(initialNotifications || []);
    const [pagination, setPagination] = useState(initialPagination || {});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const fetchNotifications = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(route('admin.notifications.data'), {
                params: {
                    page,
                    search: searchTerm,
                    type: filterType,
                    status: filterStatus
                }
            });
            setNotifications(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [searchTerm, filterType, filterStatus]);

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(route('admin.notifications.read', notificationId));
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === notificationId 
                        ? { ...notif, is_read: true }
                        : notif
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(route('admin.notifications.read-all'));
            setNotifications(prev => 
                prev.map(notif => ({ ...notif, is_read: true }))
            );
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

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

    const getTypeLabel = (type) => {
        switch (type) {
            case 'schedule_confirmed':
                return 'Jadwal Dikonfirmasi';
            case 'report_approved':
                return 'Laporan Disetujui';
            case 'user_added':
                return 'Pengguna Baru';
            case 'meeting_created':
                return 'Pertemuan Baru';
            case 'meeting_cancelled':
                return 'Pertemuan Dibatalkan';
            case 'report_rejected':
                return 'Laporan Ditolak';
            default:
                return 'Notifikasi';
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <ThemeProvider>
            <NotificationProvider>
                <Head title="Notifikasi" />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
                    {/* Sidebar */}
                    <Sidebar auth={auth} activeMenu="Notifikasi" />

                    {/* Main Content */}
                    <div className="flex-1 p-8">
                        {/* Header */}
                        <Header 
                            title="NOTIFIKASI" 
                            subtitle="Kelola dan pantau semua notifikasi sistem"
                        />

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Notifikasi</p>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{pagination.total || 0}</p>
                                    </div>
                                    <Bell className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Belum Dibaca</p>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{unreadCount}</p>
                                    </div>
                                    <AlertCircle className="w-8 h-8 text-red-500" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Sudah Dibaca</p>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{(pagination.total || 0) - unreadCount}</p>
                                    </div>
                                    <Check className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Hari Ini</p>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                            {notifications.filter(n => {
                                                const today = new Date();
                                                const created = new Date(n.created_at);
                                                return created.toDateString() === today.toDateString();
                                            }).length}
                                        </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-orange-500" />
                                </div>
                            </div>
                        </div>

                        {/* Filters and Actions */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                    {/* Search */}
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Cari notifikasi..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Type Filter */}
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Semua Jenis</option>
                                        <option value="schedule_confirmed">Jadwal Dikonfirmasi</option>
                                        <option value="report_approved">Laporan Disetujui</option>
                                        <option value="user_added">Pengguna Baru</option>
                                        <option value="meeting_created">Pertemuan Baru</option>
                                        <option value="meeting_cancelled">Pertemuan Dibatalkan</option>
                                        <option value="report_rejected">Laporan Ditolak</option>
                                    </select>

                                    {/* Status Filter */}
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="unread">Belum Dibaca</option>
                                        <option value="read">Sudah Dibaca</option>
                                    </select>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                                        >
                                            <CheckCheck className="w-4 h-4" />
                                            Tandai Semua Dibaca
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                            {loading ? (
                                <div className="flex items-center justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
                                            className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                                                !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            {notification.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {formatTimeAgo(notification.created_at)}
                                                            </span>
                                                            {!notification.is_read && (
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                                            {getTypeLabel(notification.type)}
                                                        </span>
                                                        {notification.data && Object.keys(notification.data).length > 0 && (
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                Data tersedia
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {pagination.last_page > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            Menampilkan {((pagination.current_page - 1) * pagination.per_page) + 1} sampai {Math.min(pagination.current_page * pagination.per_page, pagination.total)} dari {pagination.total} notifikasi
                                        </div>
                                        <div className="flex gap-2">
                                            {pagination.current_page > 1 && (
                                                <button
                                                    onClick={() => fetchNotifications(pagination.current_page - 1)}
                                                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    Sebelumnya
                                                </button>
                                            )}
                                            {pagination.current_page < pagination.last_page && (
                                                <button
                                                    onClick={() => fetchNotifications(pagination.current_page + 1)}
                                                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    Selanjutnya
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notification Popup */}
                    <NotificationPopup />
                </div>
            </NotificationProvider>
        </ThemeProvider>
    );
};

export default NotificationsPage;
