// Components/Admin/Sidebar.jsx
import React from 'react';     
import { LogOut, Settings, Moon, Sun } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useTheme } from '../../Contexts/ThemeContext';

export default function Sidebar({ auth, activeMenu = 'DASHBOARD' }) {
    const { isDarkMode, toggleDarkMode } = useTheme();
    
    const menuItems = [
        { name: 'DASHBOARD', active: activeMenu === 'DASHBOARD' },
        { name: 'Manajemen Member', active: activeMenu === 'Manajemen Member' },
        { name: 'Manajemen Mentor', active: activeMenu === 'Manajemen Mentor' },
        { name: 'Verifikasi Pertemuan', active: activeMenu === 'Verifikasi Pertemuan' },
        { name: 'Riwayat Pertemuan', active: activeMenu === 'Riwayat Pertemuan' },
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

    const handleMenuClick = (menuName) => {
        // Handle navigation berdasarkan menu
        switch(menuName) {
            case 'DASHBOARD':
                router.get(route('admin.dashboard')); // Mengarahkan ke rute 'dashboard'
                break;
            case 'Manajemen Member':
                router.get(route('admin.members.index')); // Mengarahkan ke rute 'members.index'
                break;
            case 'Manajemen Mentor':
                router.get(route('admin.mentors.index')); // Mengarahkan ke rute 'mentors.index'
                break;
            case 'Verifikasi Pertemuan':
                router.get(route('admin.verification.index')); // Mengarahkan ke rute 'verification.index'
                break;
            case 'Riwayat Pertemuan':
                router.get(route('admin.riwayat.index')); // Mengarahkan ke rute 'verification.index' (sementara)
                break;
            case 'Notifikasi':
                router.get(route('admin.notifications.index')); // Mengarahkan ke rute 'notifications.index'
                break;
        }
    };

    return (
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
            <div className="p-6">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">ADMIN PANEL</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Hi, {auth?.user?.name || 'Administrator'}</p>
                    </div>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleMenuClick(item.name)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                item.active 
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {item.name}
                        </button>
                    ))}
                </nav>


                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center space-x-2 mt-8 w-full justify-center"
                >
                    <LogOut className="w-4 h-4" />
                    <span>KELUAR</span>
                </button>
            </div>
        </div>
    );
}