import React from 'react';
import { X, Calendar, Clock, User, Briefcase, FileText, AlertCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ScheduleDetailModal({ isOpen, onClose, schedule, memberProfile }) {
    if (!isOpen || !schedule) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        if (!time) return '09:00';
        return time.substring(0, 5);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'pending_approval':
            case 'pending_rejection':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed':
                return 'Dikonfirmasi';
            case 'pending_approval':
                return 'Menunggu Persetujuan';
            case 'pending_rejection':
                return 'Menunggu Konfirmasi';
            case 'rejected':
                return 'Ditolak';
            case 'completed':
                return 'Selesai';
            default:
                return 'Tidak Diketahui';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="w-5 h-5" />;
            case 'rejected':
                return <XCircle className="w-5 h-5" />;
            case 'pending_approval':
            case 'pending_rejection':
                return <AlertTriangle className="w-5 h-5" />;
            case 'completed':
                return <CheckCircle className="w-5 h-5" />;
            default:
                return <AlertCircle className="w-5 h-5" />;
        }
    };

    const getMeetingTypeColor = (meetingType) => {
        return meetingType === 'Daring' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' 
            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    };

    const getMeetingTypeText = (meetingType) => {
        return meetingType || 'Luring';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Detail Jadwal
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-center">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(schedule.status)}`}>
                            {getStatusIcon(schedule.status)}
                            <span>{getStatusText(schedule.status)}</span>
                        </span>
                    </div>

                    {/* Mentor Information */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {schedule.mentor?.name ? schedule.mentor.name.charAt(0).toUpperCase() : 'M'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {schedule.mentor?.name || 'Nama Mentor'}
                                </h3>
                                {schedule.mentor?.email && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {schedule.mentor.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Schedule Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Date */}
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Tanggal
                                </p>
                                <p className="text-base font-semibold text-gray-900 dark:text-white">
                                    {formatDate(schedule.proposed_date)}
                                </p>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Waktu
                                </p>
                                <p className="text-base font-semibold text-gray-900 dark:text-white">
                                    {formatTime(schedule.proposed_time)}
                                </p>
                            </div>
                        </div>

                        {/* Training Type */}
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Jenis Pelatihan
                                </p>
                                <p className="text-base font-semibold text-gray-900 dark:text-white">
                                    {schedule.training_type || 'Tidak Diketahui'}
                                </p>
                            </div>
                        </div>

                        {/* Meeting Type */}
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Jenis Pertemuan
                                </p>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${getMeetingTypeColor(memberProfile?.meeting_type)}`}>
                                    {getMeetingTypeText(memberProfile?.meeting_type)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Materi Information */}
                    {(schedule.materi_modul || schedule.materi_topik || schedule.materi_sub_topik) && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Materi Pembelajaran
                                </h4>
                            </div>
                            <div className="space-y-2">
                                {schedule.materi_modul && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Modul:
                                        </p>
                                        <p className="text-base text-gray-900 dark:text-white">
                                            {schedule.materi_modul}
                                        </p>
                                    </div>
                                )}
                                {schedule.materi_topik && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Topik:
                                        </p>
                                        <p className="text-base text-gray-900 dark:text-white">
                                            {schedule.materi_topik}
                                        </p>
                                    </div>
                                )}
                                {schedule.materi_sub_topik && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Sub Topik:
                                        </p>
                                        <p className="text-base text-gray-900 dark:text-white">
                                            {schedule.materi_sub_topik}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Rejection Reason */}
                    {schedule.status === 'rejected' && schedule.rejection_reason && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-start space-x-2">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
                                        Alasan Penolakan
                                    </h4>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        {schedule.rejection_reason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

