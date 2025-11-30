import React from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '../../Components/Admin/Sidebar'; // Sesuaikan path jika perlu
import Header from '../../Components/Admin/Header'; // Sesuaikan path
import MentorManagementContent from '../../Components/Admin/MentorManagementContent';
import NotificationPopup from '../../Components/Admin/NotificationPopup';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { NotificationProvider } from '../../Contexts/NotificationContext';

// Halaman ini HANYA menerima props dan menyusun layout
export default function MentorManagement({ auth, specializations, availableDays }) {
    const pageTitle = "Manajemen Mentor";
    const pageSubtitle = "Kelola data mentor dan spesialisasi mereka";

    return (
        <ThemeProvider>
            <NotificationProvider>
                <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                    <Head title={pageTitle} />
                    <Sidebar auth={auth} activeMenu="Manajemen Mentor" />
                    
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
                            <Header title={pageTitle} subtitle={pageSubtitle} />
                            <div className="mt-8">
                                {/* Data 'specializations' diteruskan ke komponen Content */}
                                <MentorManagementContent specializations={specializations} availableDays={availableDays} />
                            </div>
                        </main>
                    </div>
                    
                    {/* Notification Popup */}
                    <NotificationPopup />
                </div>
            </NotificationProvider>
        </ThemeProvider>
    );
}