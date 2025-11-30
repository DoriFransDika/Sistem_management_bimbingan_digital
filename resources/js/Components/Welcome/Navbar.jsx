import React from 'react';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

const Navbar = ({ auth }) => {
    return (
        <header className="fixed top-0 left-20 right-10 z-50 bg-blue-950 bg-opacity-90 backdrop-blur-sm shadow-lg flex justify-between items-center py-4 px-6 lg:px-20">
            <div className="flex items-center">
                <img src="/img/mediatama.png" alt="TugasKu Logo" className="block h-16 w-auto" />
                <div className='flex flex-col'>
                    <span className="ml-2 text-2xl font-serif font-extrabold text-white">MEDIATAMA WEB</span>
                    <span className="ml-2 text-sm  text-white">SISTEM LAYANAN BIMBINGAN DIGITAL</span>
                </div>
            </div>
            <nav className="flex space-x-6  items-center">
                <Link href="/" className="text-white hover:text-gray-300 transition-colors duration-200">
                    Beranda
                </Link>
                <Link href="#fitur" className="text-white hover:text-gray-300 transition-colors duration-200">
                    Fitur
                </Link>
                <Link href="#faq" className="text-white hover:text-gray-300 transition-colors duration-200">
                    FAQ
                </Link>
                {auth.user ? (
                    <Link href={route('dashboard')} className="font-semibold text-white hover:text-gray-300 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href={route('login')}
                            className="bg-white text-blue-950 font-bold py-2 px-4 rounded-full shadow-lg transition-colors duration-200 hover:bg-gray-200"
                        >
                            Masuk
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
