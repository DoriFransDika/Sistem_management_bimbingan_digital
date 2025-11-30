import React from 'react';
import { CheckCircle, Clock, Star, Users } from 'lucide-react';

export default function PerformanceSummary({ stats }) {
    const performanceConfig = [
        {
            title: "Total Sesi Selesai",
            value: stats?.totalSessionsCompleted || 0,
            subtitle: "Sesi Terselesaikan",
            icon: CheckCircle,
            color: "green"
        },
        {
            title: "Permintaan Tertunda",
            value: stats?.pendingRequests || 0,
            subtitle: "Menunggu Konfirmasi",
            icon: Clock,
            color: "yellow"
        },
        {
            title: "Rating Rata - Rata",
            value: stats?.averageRating || '0.0',
            subtitle: "Dari Member",
            icon: Star,
            color: "blue",
            isRating: true
        }
    ];

    const getColorClasses = (color) => {
        const colorMap = {
            blue: { border: 'border-blue-500', text: 'text-blue-600', icon: 'text-blue-500' },
            green: { border: 'border-green-500', text: 'text-green-600', icon: 'text-green-500' },
            yellow: { border: 'border-yellow-500', text: 'text-yellow-600', icon: 'text-yellow-500' },
            red: { border: 'border-red-500', text: 'text-red-600', icon: 'text-red-500' }
        };
        return colorMap[color] || colorMap.blue;
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ringkasan Kinerja</h2>
            <div className="grid grid-cols-3 gap-4">
                {performanceConfig.map((stat, index) => {
                    const colors = getColorClasses(stat.color);
                    const Icon = stat.icon;
                    
                    return (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600"
                        >
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                    {stat.title}
                                </p>
                                <div className="flex items-center justify-center space-x-2 mb-1">
                                    {stat.isRating ? (
                                        <>
                                            <Star className={`w-5 h-5 ${colors.icon} fill-current`} />
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {stat.value}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-xs font-medium ${colors.text}`}>
                                    {stat.subtitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

