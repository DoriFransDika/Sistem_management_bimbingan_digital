import React from 'react';
import { User, Users, FileText, RefreshCw } from 'lucide-react';

export default function ActivityLog({ activities, loading }) {
    const getActivityIcon = (type) => {
        switch (type) {
            case 'mentor':
                return <User className="w-3 h-3 text-green-500" />;
            case 'report':
                return <FileText className="w-3 h-3 text-blue-500" />;
            case 'user':
                return <Users className="w-3 h-3 text-purple-500" />;
            default:
                return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Log Aktivitas Terbaru</h3>
                {loading && <RefreshCw className="w-4 h-4 animate-spin text-gray-400 dark:text-gray-500" />}
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                            {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{activity.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                    Lihat Semua Aktivitas →
                </button>
            </div>
        </div>
    );
}