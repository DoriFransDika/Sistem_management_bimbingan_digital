// Pages/Admin/MemberManagement.jsx
import React from 'react';
import Sidebar from '../../Components/Admin/Sidebar';
import Header from '../../Components/Admin/Header';
import MemberManagementContent from '../../Components/Admin/MemberManagementContent';
import NotificationPopup from '../../Components/Admin/NotificationPopup';
import { Head } from '@inertiajs/react';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { NotificationProvider } from '../../Contexts/NotificationContext';

export default function MemberManagement({ auth }) {
    const pageTitle = "MANAJEMEN MEMBER";
    const pageSubtitle = "Pusat Manajemen Member Digital";

    return (
        <ThemeProvider>
            <NotificationProvider>
                <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                    <Head title={pageTitle} />
                    <Sidebar auth={auth} activeMenu="Manajemen Member" />
                    
                    <div className="flex-1 p-8 overflow-auto">
                        <Header title={pageTitle} subtitle={pageSubtitle} />
                        <MemberManagementContent />
                    </div>
                    
                    {/* Notification Popup */}
                    <NotificationPopup />
                </div>
            </NotificationProvider>
        </ThemeProvider>
    );
}