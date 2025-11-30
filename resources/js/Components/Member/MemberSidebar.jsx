import React from 'react';
import { LogOut, Settings, Moon, Sun } from 'lucide-react';
import { router, Link } from '@inertiajs/react';
import { useTheme } from '../../Contexts/ThemeContext';

export default function MemberSidebar({ auth, activeMenu = 'HALAMAN UTAMA' }) {
    const { isDarkMode, toggleDarkMode } = useTheme();
    
    const menuItems = [
        { name: 'HALAMAN UTAMA', active: activeMenu === 'HALAMAN UTAMA' },
        { name: 'Jadwal', active: activeMenu === 'Jadwal' },
        { name: 'Riwayat', active: activeMenu === 'Riwayat' },
        { name: 'Notifikasi', active: activeMenu === 'Notifikasi' },
    ];

    const handleLogout = () => {
        if (confirm("Apakah Anda yakin ingin logout?")) {
            if (typeof router !== 'undefined') {
                router.post(route("logout"), {}, {
                    onSuccess: () => {
                        window.location.href = "/login";
                    }
                });
            } else {
                // Fallback untuk demo
                alert("Logout berhasil!");
            }
        }
    };


    return (
        <div className="w-64 bg-white dark:bg-gray-800 min-h-screen flex flex-col border-r border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-gray-900 dark:text-white font-bold text-lg">MEMBER PANEL</h2>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Hi, {auth.user.name}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const getHref = (menuName) => {
                            switch(menuName) {
                                case 'HALAMAN UTAMA':
                                    return route('member.dashboard');
                                case 'Jadwal':
                                    return route('member.jadwal');
                                case 'Riwayat':
                                    return '/member/riwayat';
                                case 'Notifikasi':
                                    return route('member.notifications.index');
                                default:
                                    return '#';
                            }
                        };

                        return (
                            <li key={item.name}>
                                <Link
                                    href={getHref(item.name)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 block ${
                                        item.active
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Theme Toggle */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {isDarkMode ? (
                            <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        ) : (
                            <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        )}
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </span>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isDarkMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">→ KELUAR</span>
                </button>
            </div>
        </div>
    );
};
