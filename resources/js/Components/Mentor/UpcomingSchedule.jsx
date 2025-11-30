import React from 'react';
import { Calendar, Clock, MapPin, Wifi, User } from 'lucide-react';

export default function UpcomingSchedule({ schedules }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
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
            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    };

    if (!schedules || schedules.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Belum ada jadwal terkonfirmasi
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
                {schedules.map((schedule, index) => {
                    const TypeIcon = getMeetingTypeIcon(schedule.meeting_type);
                    
                    return (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                        {schedule.member_name || 'Member'}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(schedule.scheduled_date)}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>pukul {formatTime(schedule.scheduled_time)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(schedule.meeting_type)}`}>
                                    <TypeIcon className="w-3 h-3 inline mr-1" />
                                    {getMeetingTypeLabel(schedule.meeting_type)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

