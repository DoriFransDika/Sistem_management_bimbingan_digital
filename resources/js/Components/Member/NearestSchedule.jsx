import React from 'react';
import { Calendar, Clock, MapPin, Wifi } from 'lucide-react';

export default function NearestSchedule({ schedule }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return timeString || '10:00';
    };

    const getMeetingTypeIcon = (type) => {
        return type === 'online' || type === 'daring' ? Wifi : MapPin;
    };

    const getMeetingTypeLabel = (type) => {
        return type === 'online' || type === 'daring' ? 'Daring' : 'Luring';
    };

    const getMeetingTypeColor = (type) => {
        return type === 'online' || type === 'daring' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    };

    if (!schedule) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Belum ada jadwal terdekat
                    </p>
                </div>
            </div>
        );
    }

    const TypeIcon = getMeetingTypeIcon(schedule.meeting_type);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Bimbingan dengan {schedule.mentor_name || 'Mentor'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(schedule.scheduled_date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>pukul {formatTime(schedule.scheduled_time)} WIB</span>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(schedule.meeting_type)}`}>
                            <TypeIcon className="w-3 h-3 inline mr-1" />
                            {getMeetingTypeLabel(schedule.meeting_type)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};




















