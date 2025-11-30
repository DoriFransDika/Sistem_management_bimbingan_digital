import React from "react";
import { Edit, Check, Clock } from "lucide-react"; // Impor yang tidak digunakan, bisa dihapus jika tidak diperlukan.

    const Beranda = () => {
        return (
            <div className="text-center py-20 lg:py-32 p-40">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Bagian Teks & Tombol */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                            PLATFORM INOVATIF <br /> MASA DEPAN BIMBINGAN
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto lg:mx-0 text-lg text-gray-300">
                            Hubungkan member dengan mentor terbaik di bidangnya.
                            Kelola jadwal, lacak progres, dan fasilitasi komunikasi
                            dengan mudah dalam satu ekosistem terpadu.
                        </p>
                        <div className="py-10 flex justify-center lg:justify-start">
                            <a
                                href="/login"
                                className="bg-white text-blue-950 font-bold py-5 px-10 rounded-xl shadow-lg transition-colors duration-200 hover:bg-gray-200 text-xl"
                            >
                                MULAI BIMBINGAN
                            </a>
                        </div>
                    </div>

                    {/* Bagian Gambar Ilustrasi */}
                    <div className="w-full lg:w-1/2 mt-16 lg:mt-0 flex justify-center">
                        <img
                            src="/img/ilustrasi.png" // Ganti dengan jalur gambar Anda
                            alt="Ilustrasi"
                            className="w-full h-auto rounded-xl md:max-w-md lg:max-w-lg"
                        />
                    </div>
                </div>
            </div>
        );
    };

export default Beranda;
