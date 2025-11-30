import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    // Data pertanyaan dan jawaban
    const faqData = [
        {
            question: "Bagaimana proses orientasi untuk anggota baru?",
            answer: "Kami menawarkan proses onboarding yang terstruktur untuk membantu anggota baru memahami fitur platform, memilih mentor yang tepat, dan memulai sesi bimbingan pertama mereka dengan lancar."
        },
        {
            question: "Apa kriteria yang digunakan untuk memilih mentor?",
            answer: "Semua mentor kami melalui seleksi ketat yang mencakup verifikasi keahlian, pengalaman profesional, dan kemampuan mengajar. Kami memastikan bahwa setiap mentor adalah ahli di bidangnya."
        },
        {
            question: "Apakah ada jaminan keberhasilan setelah bimbingan?",
            answer: "Keberhasilan bergantung pada komitmen dan partisipasi aktif anggota. Namun, kami menjamin Anda akan mendapatkan bimbingan berkualitas tinggi dan akses ke sumber daya yang relevan untuk mencapai tujuan Anda."
        },
        {
            question: "Bagaimana cara melacak progres pembelajaran saya?",
            answer: "Setiap anggota memiliki dasbor personal yang menampilkan ringkasan progres, riwayat sesi, dan feedback dari mentor. Anda dapat memantau pencapaian Anda secara real-time."
        },
        {
            question: "Apakah platform ini menyediakan dukungan teknis?",
            answer: "Ya, tim dukungan teknis kami siap membantu Anda dengan masalah apa pun yang mungkin Anda hadapi saat menggunakan platform. Anda bisa menghubungi kami melalui halaman kontak atau fitur live chat."
        },
        {
            question: "Bagaimana cara memberikan ulasan dan rating untuk mentor?",
            answer: "Setelah setiap sesi selesai, Anda akan memiliki opsi untuk memberikan ulasan dan rating. Masukan Anda sangat berharga untuk membantu kami menjaga kualitas layanan."
        },
    ];

    // State untuk mengelola FAQ yang sedang terbuka
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="bg-zinc-200 py-20">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-blue-950">
                        FAQ
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Jawaban atas pertanyaan yang paling sering diajukan.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqData.map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl shadow-md">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex justify-between items-center p-6 text-left focus:outline-none transition-colors duration-200 hover:bg-gray-100 rounded-xl"
                            >
                                <span className="text-lg font-semibold text-gray-800">
                                    {item.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-6 h-6 text-blue-600" />
                                ) : (
                                    <ChevronDown className="w-6 h-6 text-gray-500" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="p-6 border-t border-gray-200">
                                    <p className="text-gray-600">
                                        {item.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
