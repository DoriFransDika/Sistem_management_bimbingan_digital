import React from 'react';
import { Users, User, Calendar, BookOpen } from 'lucide-react';

export default function MemberStats({ stats }) {
    const statsConfig = [
        {
            title: "Sisa Pertemuan",
            value: stats?.remainingSessions || 0,
            subtitle: "Sesi Tersisa",
            icon: Users,
            color: "blue"
        },
        {
            title: "Pertemuan Mendatang",
            value: stats?.upcomingSessions || 0,
            subtitle: "Jadwal Terdekat",
            icon: Calendar,
            color: "green"
        },
        {
            title: "Pelatihan",
            value: stats?.trainingType || "Administrasi Perkantoran",
            subtitle: "Program Aktif",
            icon: BookOpen,
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statsConfig.map((stat, index) => {
                const colors = getColorClasses(stat.color);
                const Icon = stat.icon;
                
                return (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 border-l-4 shadow-sm border border-gray-200 dark:border-gray-700"
                        style={{ borderLeftColor: colors.border.replace('border-', '').replace('-500', '') }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                    {stat.title}
                                </p>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </div>
                                <p className={`text-sm font-medium ${colors.text}`}>
                                    {stat.subtitle}
                                </p>
                            </div>
                            <div className="ml-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.icon.replace('text-', 'bg-').replace('-500', '-50')} dark:${colors.icon.replace('text-', 'bg-').replace('-500', '-900/20')}`}>
                                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
