import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X as XIcon, RefreshCw } from 'lucide-react';

// ===================================================================
// Komponen Modal Konfirmasi
// ===================================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, rejection, action }) => {
    if (!isOpen) return null;
    
    const isApproving = action === 'approve';
    const mentorName = rejection?.mentor?.name;
    const memberName = rejection?.member?.name;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
                <h3 className="text-xl font-bold mb-2">
                    {isApproving ? 'Konfirmasi Penolakan' : 'Tolak Pengajuan Penolakan?'}
                </h3>
                <p className="text-gray-600 mb-4">
                    Oleh: <span className="font-semibold">{mentorName}</span> untuk <span className="font-semibold">{memberName}</span>
                </p>
                <div className="bg-gray-100 p-3 rounded-lg mb-6">
                    <p className="text-sm text-gray-500">Alasan Penolakan:</p>
                    <p className="italic text-gray-800">"{rejection.rejection_reason}"</p>
                </div>
                <div className="flex justify-center gap-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg">Batal</button>
                    <button 
                        onClick={onConfirm}
                        className={`px-6 py-2 text-white rounded-lg ${isApproving ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                        {isApproving ? 'Ya, Setujui Penolakan' : 'Ya, Tolak Pengajuan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ===================================================================
// Komponen Card Penolakan
// ===================================================================
const RejectionCard = ({ rejection, onProcess }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-lg">PENOLAKAN JADWAL</h4>
                    <p className="text-sm text-gray-600">
                        Oleh: <span className="font-semibold">{rejection.mentor.name}</span> | Untuk: <span className="font-semibold">{rejection.member.name}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{rejection.proposed_date}</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => onProcess(rejection, 'approve')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 transition"
                    >
                        Setujui
                    </button>
                    <button 
                        onClick={() => onProcess(rejection, 'reject')}
                        className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition"
                    >
                        Tolak
                    </button>
                </div>
            </div>
            <hr className="my-3" />
            <div>
                <span className="font-semibold">Alasan:</span>
                <p className="text-gray-700 italic">"{rejection.rejection_reason}"</p>
            </div>
        </div>
    );
};


// ===================================================================
// Komponen Konten Utama
// ===================================================================
export default function VerificationContent() {
    const [rejections, setRejections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRejection, setSelectedRejection] = useState(null);
    const [modalAction, setModalAction] = useState(''); // 'approve' or 'reject'

    const fetchRejections = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('admin.verification.data'));
            setRejections(response.data);
        } catch (error) {
            console.error("Gagal mengambil data penolakan:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRejections();
    }, []);
    
    const handleOpenModal = (rejection, action) => {
        setSelectedRejection(rejection);
        setModalAction(action);
    };

    const handleCloseModal = () => {
        setSelectedRejection(null);
        setModalAction('');
    };

    const handleConfirmAction = async () => {
        if (!selectedRejection) return;

        const url = modalAction === 'approve'
            ? route('admin.verification.approve', selectedRejection.Id_schedles)
            : route('admin.verification.reject', selectedRejection.Id_schedles);
        
        try {
            await axios.post(url);
            fetchRejections(); 
        } catch (error) {
            console.error("Gagal memproses aksi:", error);
            alert('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            handleCloseModal();
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    {/* Judul ini sekarang akan di-handle oleh komponen Header di halaman utama */}
                </div>
                <button onClick={fetchRejections} disabled={loading} className="p-2 rounded-full hover:bg-gray-100">
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {loading ? (
                <p>Memuat data...</p>
            ) : rejections.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <Check className="w-12 h-12 mx-auto text-green-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-700">Tidak Ada Penolakan</h3>
                    <p className="mt-1 text-sm text-gray-500">Semua permintaan sudah diproses.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {rejections.map(rejection => (
                        <RejectionCard key={rejection.Id_schedles} rejection={rejection} onProcess={handleOpenModal} />
                    ))}
                </div>
            )}

            <ConfirmationModal
                isOpen={!!selectedRejection}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAction}
                rejection={selectedRejection}
                action={modalAction}
            />
        </>
    );
}