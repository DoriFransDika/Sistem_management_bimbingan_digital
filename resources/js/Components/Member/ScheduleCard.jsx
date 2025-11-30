import React from 'react';
import { Eye, Calendar, Clock, Briefcase, CheckCircle } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ScheduleCard({ schedule, memberProfile, onDetailClick }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        // Format time from HH:MM:SS to HH:MM
        if (!time) return '09:00';
        return time.substring(0, 5);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending_rejection':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed':
                return 'Dikonfirmasi';
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

    const getMeetingTypeColor = (meetingType) => {
        return meetingType === 'Daring' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
    };

    const getMeetingTypeText = (meetingType) => {
        return meetingType || 'Luring';
    };

    const handleMarkCompleted = () => {
        if (confirm('Apakah Anda yakin ingin menandai jadwal ini sebagai selesai? Jadwal akan dipindahkan ke riwayat.')) {
            router.post(`/member/jadwal/${schedule.id}/complete`, {}, {
                onSuccess: () => {
                    // Success message will be handled by the controller
                }
            });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                        {schedule.mentor?.name ? schedule.mentor.name.charAt(0).toUpperCase() : 'M'}
                    </span>
                </div>

                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {getStatusText(schedule.status)}
                </span>
            </div>

            {/* Mentor Name */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {schedule.mentor?.name || 'Nama Mentor'}
            </h3>

            {/* Date */}
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">{formatDate(schedule.proposed_date)}</span>
            </div>

            {/* Time */}
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">{formatTime(schedule.proposed_time)}</span>
            </div>

            {/* Meeting Type Tag */}
            <div className="mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(memberProfile?.meeting_type)}`}>
                    {getMeetingTypeText(memberProfile?.meeting_type)}
                </span>
            </div>

            {/* Training Type */}
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="text-sm">{schedule.training_type}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button 
                    onClick={() => onDetailClick && onDetailClick(schedule)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                >
                    <Eye className="w-4 h-4 mr-2" />
                    Detail
                </button>
                
                {/* Show "Tandai Selesai" button only for confirmed schedules */}
                {schedule.status === 'confirmed' && (
                    <button 
                        onClick={handleMarkCompleted}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Tandai Selesai
                    </button>
                )}
            </div>
        </div>
    );
};
