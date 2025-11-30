import React from 'react';
import { CheckSquare, ListTodo, History, Tag, MessageSquare, Briefcase, Settings, Lock, Zap, Sun, Palette, Globe, Shield, BarChart2 } from 'lucide-react';

const Fitur = () => {
    // Data fitur untuk mempermudah rendering
    const mainFeatures = [
        {
            title: 'Dapat Memilih Jadwal Sesuai Kebutuhan',
            description: 'Kelola semua tugas yang belum selesai dengan pengelompokan, filter, dan pencarian.',
            icon: <BarChart2 className="w-12 h-12 text-white" />,
            color: 'bg-indigo-500',
        },
        {
            title: 'Bebas Memilih Pembimbing/Mentor Yang Tersedia dan Sesuai Keterampilan Pembimbing/Mentor Tersebut',
            description: 'Kelola semua tugas yang belum selesai dengan pengelompokan, filter, dan pencarian.',
            icon: <ListTodo className="w-12 h-12 text-white" />,
            color: 'bg-green-500',
        },
        {
            title: 'Bebas Memilih Kursus Secara Daring & Luring',
            description: 'Lihat kembali tugas-tugas yang sudah selesai dan pantau progres produktivitas Anda.',
            icon: <History className="w-12 h-12 text-white" />,
            color: 'bg-orange-500',
        },
        {
            title: 'Mentor Dapat Membuat Laporan Setelah Setiap Sesi, Dan Admin Dapat Memverifikasinya Progres Belajar Member Yang Tercatat.',
            description: 'Buat dan atur kategori untuk mengorganisir tugas dengan lebih terperinci.',
            icon: <Tag className="w-12 h-12 text-white" />,
            color: 'bg-purple-500',
        },
        {
            title: 'Setiap laporan sesi dan penolakan jadwal akan diverifikasi oleh admin untuk menjaga kualitas dan keadilan dalam proses bimbingan.',
            description: 'Berikan masukan dan saran langsung melalui form sederhana untuk pengembangan aplikasi.',
            icon: <MessageSquare className="w-12 h-12 text-white" />,
            color: 'bg-red-500',
        },
        {
            title: 'Nikmati kenyamanan bekerja dengan antarmuka yang fleksibel dan Kekinian',
            description: 'Fitur tambahan untuk mengelola proyek dan tugas-tugas terkait secara terstruktur.',
            icon: <Briefcase className="w-12 h-12 text-white" />,
            color: 'bg-yellow-500',
        },
    ];

    const additionalFeatures = [
        {
            title: 'Pengalaman Dan Keahlian',
            description: 'Tim kami terdiri dari profesional berpengalaman dengan keahlian di berbagai bidang teknologi informasi.',
            icon: <Sun className="w-6 h-6 text-gray-500" />,
        },
        {
            title: 'Solusi Dan Kostumisasi',
            description: 'Kami memahami bahwa setiap client memiliki kebutuhan unik, oleh karena itu kami menyediakan solusi yang terbaik.',
            icon: <Palette className="w-6 h-6 text-gray-500" />,
        },
        {
            title: 'Pendekatan Inovatif',
            description: 'Kami selalu mengikuti trend teknologi terbaru untuk memberikan solusi yang inovatif dan relavan',
            icon: <Zap className="w-6 h-6 text-gray-500" />,
        },
        {
            title: 'Manajemen Hak Akses',
            description: 'Kelola peran dan hak akses pengguna untuk memastikan keamanan data.',
            icon: <Lock className="w-6 h-6 text-gray-500" />,
        },
    ];

    return (
        <section id="fitur" className="bg-gray-50 py-20">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-blue-950">
                        Fitur Unggulan
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Semua yang Anda butuhkan untuk mengelola tugas dan meningkatkan produktivitas.
                    </p>
                </div>

                {/* Grid Fitur Utama */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {mainFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-start p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <div className={`p-4 rounded-full shadow-lg ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h3 className="mt-6 text-2xl font-bold text-gray-800">{feature.title}</h3>
                            <p className="mt-2 text-gray-500">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Fitur Tambahan */}
                <div className="mt-24 text-center">
                    <h3 className="text-3xl font-bold text-blue-950">
                        Fitur Tambahan Lainnya
                    </h3>
                </div>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {additionalFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start p-6 bg-white rounded-xl shadow-md border border-gray-100 transform transition-transform duration-300 hover:scale-105">
                            <div className="p-3 rounded-full bg-gray-100">
                                {feature.icon}
                            </div>
                            <div className="ml-4 text-left">
                                <h4 className="text-lg font-semibold text-gray-800">{feature.title}</h4>
                                <p className="text-sm text-gray-500">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Fitur;
