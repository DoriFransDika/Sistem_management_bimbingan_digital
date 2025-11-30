import React, { useState } from 'react';
import { Check, X, Calendar, User, Briefcase, MapPin, Link, Clock } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function RequestCard({ request, type = 'pending' }) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '10:00';
        // If timeString is already in HH:MM format, return as is
        if (typeof timeString === 'string' && timeString.includes(':')) {
            return timeString.substring(0, 5); // Take only HH:MM
        }
        // If it's a date, format it
        return new Date(timeString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMeetingTypeColor = (meetingType) => {
        return meetingType === 'Daring' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
    };

    const handleAccept = () => {
        router.post(route('mentor.permintaan-masuk.accept', request.id), {}, {
            onSuccess: () => {
                // Success message will be handled by Inertia
            }
        });
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert('Mohon isi alasan penolakan');
            return;
        }

        router.post(route('mentor.permintaan-masuk.reject', request.id), {
            rejection_reason: rejectionReason
        }, {
            onSuccess: () => {
                setShowRejectModal(false);
                setRejectionReason('');
            }
        });
    };

    const handleMarkCompleted = () => {
        if (confirm('Apakah Anda yakin ingin menandai jadwal ini sebagai selesai?')) {
            // Determine which route to use based on current page
            const currentPath = window.location.pathname;
            const routeName = currentPath.includes('jadwal-terkonfirmasi') 
                ? 'mentor.jadwal-terkonfirmasi.complete'
                : 'mentor.permintaan-masuk.complete';
            
            router.post(route(routeName, request.id), {}, {
                onSuccess: () => {
                    // Success message will be handled by Inertia
                }
            });
        }
    };

    const isPastDate = new Date(request.proposed_date) < new Date();

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                            {request.member?.name ? request.member.name.charAt(0).toUpperCase() : 'M'}
                        </span>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        type === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                        {type === 'pending' ? 'Menunggu Konfirmasi' : 'Dikonfirmasi'}
                    </span>
                </div>

                {/* Member Name */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Permintaan dari {request.member?.name || 'Nama Member'}
                </h3>

                {/* Date and Time */}
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{formatDate(request.proposed_date)}</span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{formatTime(request.proposed_time || request.proposed_date)}</span>
                </div>

                {/* Training Type */}
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span className="text-sm">{request.training_type}</span>
                </div>

                {/* Meeting Type */}
                <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(request.meeting_type || 'Luring')}`}>
                        {request.meeting_type || 'Luring'}
                    </span>
                </div>

                {/* Meeting Link (only for Daring) */}
                {request.meeting_type === 'Daring' && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center text-blue-700 dark:text-blue-300">
                            <Link className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Link Meeting:</span>
                        </div>
                        <a 
                            href="https://meet.google.com/xxx-xxxx-xxx" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                        >
                            https://meet.google.com/xxx-xxxx-xxx
                        </a>
                    </div>
                )}

                {/* Action Buttons */}
                {type === 'pending' ? (
                    <div className="flex space-x-2">
                        <button 
                            onClick={handleAccept}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Terima
                        </button>
                        <button 
                            onClick={() => setShowRejectModal(true)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Tolak
                        </button>
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        {isPastDate ? (
                            <button 
                                onClick={handleMarkCompleted}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Tandai Selesai
                            </button>
                        ) : (
                            <div className="w-full text-center text-gray-500 dark:text-gray-400 text-sm py-2">
                                Jadwal belum tiba
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Alasan Penolakan
                        </h3>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Masukkan alasan penolakan..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-4"
                            rows={4}
                        />
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                            >
                                Tolak Permintaan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};




















