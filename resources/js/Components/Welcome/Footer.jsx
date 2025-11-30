import React from 'react';
import { Link } from '@inertiajs/react';
import { LogIn, UserPlus } from 'lucide-react';

const Footer = ({ auth }) => {
    return (
        <footer className="bg-blue-950 text-white py-12 px-6 lg:px-20">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
                    {/* Bagian Kiri: Nama Website dan Kutipan */}
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-serif font-extrabold text-white">MEDIATAMA WEB</h3>
                        <span className="text-sm  text-white">SISTEM LAYANAN BIMBINGAN DIGITAL</span>
                        <p className="mt-4 text-gray-400 max-w-sm">
                            "Membentuk masa depan melalui bimbingan yang terstruktur. Kami menghubungkan Anda dengan mentor terbaik untuk mewujudkan potensi diri."
                        </p>
                    </div>

                    {/* Bagian Kanan: Tombol Interaktif */}
                    <div className="flex flex-col space-y-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 text-center"
                            >
                                Pergi ke Dasbor
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    <LogIn size={20} />
                                    <span>Masuk</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    &copy; 2025 MEDIATAMA WEB. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
