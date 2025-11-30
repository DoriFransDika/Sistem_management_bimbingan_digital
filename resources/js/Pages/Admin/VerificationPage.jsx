import React from 'react';
import Sidebar from '../../Components/Admin/Sidebar'; // Sesuaikan path jika perlu
import Header from '../../Components/Admin/Header'; // Sesuaikan path jika perlu
import VerificationContent from '../../Components/Admin/VerificationContent';
import NotificationPopup from '../../Components/Admin/NotificationPopup';
import { Head } from '@inertiajs/react';
import { ThemeProvider } from '../../Contexts/ThemeContext';
import { NotificationProvider } from '../../Contexts/NotificationContext';

export default function VerificationPage({ auth }) {
    const pageTitle = "Verifikasi Penolakan";
    const pageSubtitle = "Tinjau item yang ditolak oleh mentor untuk ditindaklanjuti.";

    return (
        <ThemeProvider>
            <NotificationProvider>
                <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                    <Head title={pageTitle} />
                    <Sidebar auth={auth} activeMenu="Verifikasi Pertemuan" />
                    
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
                            <Header title={pageTitle} subtitle={pageSubtitle} />
                            <div className="mt-8">
                                <VerificationContent />
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