import React from 'react';
import { User, Users, CheckCircle } from 'lucide-react';

export default function StatsCards({ stats }) {
    const statsConfig = [
        {
            title: "Total Member",
            value: stats.totalMember,
            subtitle: "Aktif & Terdaftar",
            icon: Users,
            color: "blue"
        },
        {
            title: "Total Mentor",
            value: stats.totalMentor,
            subtitle: "Siap Membimbing",
            icon: User,
            color: "green"
        },
        {
            title: "Verifikasi Mentor",
            value: stats.verifikasiMentor,
            subtitle: "Perlu Respon Admin",
            icon: CheckCircle,
            color: "yellow"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statsConfig.map((stat, index) => {
                const colors = getColorClasses(stat.color);
                const Icon = stat.icon;
                
                return (
                    <div key={index} className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 ${colors.border}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                                <p className={`text-xs ${colors.text} mt-1`}>{stat.subtitle}</p>
                            </div>
                            <Icon className={`w-8 h-8 ${colors.icon}`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}