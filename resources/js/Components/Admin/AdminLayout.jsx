// Components/Admin/AdminLayout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ auth, activeMenu, children }) {
    // Mapping judul halaman
    const pageConfig = {
        "DASHBOARD": {
            title: "ADMIN DASHBOARD",
            subtitle: "Selamat Datang Di Pusat Kendali Sistem"
        },
        "Manajemen Member": {
            title: "MANAJEMEN MEMBER",
            subtitle: "Kelola data anggota dengan mudah"
        },
        "Manajemen Mentor": {
            title: "MANAJEMEN MENTOR",
            subtitle: "Atur data mentor dan perannya"
        },
        "Verifikasi Pertemuan": {
            title: "VERIFIKASI PERTEMUAN",
            subtitle: "Validasi pertemuan mentor dan member"
        },
        "Verifikasi Laporan": {
            title: "VERIFIKASI LAPORAN",
            subtitle: "Periksa laporan aktivitas dengan detail"
        },
        "Riwayat Pertemuan": {
            title: "RIWAYAT PERTEMUAN",
            subtitle: "Data pertemuan selesai dan filter jenis pelatihan"
        }
    };

    const { title, subtitle } = pageConfig[activeMenu] || pageConfig["DASHBOARD"];

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar auth={auth} activeMenu={activeMenu} />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <Header title={title} subtitle={subtitle} />
                {children}
            </div>
        </div>
    );
}
