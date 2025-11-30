import React, { useEffect, useRef } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { useTheme } from '../../Contexts/ThemeContext';

export default function MentorSessionsTable({ mentors = [] }) {
    const canvasRef = useRef(null);
    const { isDarkMode } = useTheme();

    // Default data jika tidak ada data mentors
    const defaultMentors = [
        { id: 1, name: 'Asep', completed_meetings_count: 5 },
        { id: 2, name: 'dori', completed_meetings_count: 3 },
        { id: 3, name: 'Rahman', completed_meetings_count: 8 },
        { id: 4, name: 'Sari', completed_meetings_count: 2 }
    ];

    const displayMentors = mentors && mentors.length > 0 ? mentors : defaultMentors;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        // Set canvas size
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height);

        const maxValue = Math.max(...displayMentors.map(m => m.completed_meetings_count || 0));
        if (maxValue === 0) return;

        const barWidth = 40;
        const barSpacing = 60;
        const chartStartX = 60;
        const chartStartY = 40;
        const chartHeight = rect.height - 120;

        // Draw bars (tubes)
        displayMentors.forEach((mentor, index) => {
            const x = chartStartX + index * (barWidth + barSpacing);
            const barHeight = ((mentor.completed_meetings_count || 0) / maxValue) * chartHeight;
            const y = rect.height - 80 - barHeight;

            // Draw tube (rounded rectangle)
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, 8);
            ctx.fillStyle = `hsl(${200 + index * 30}, 70%, 60%)`;
            ctx.fill();

            // Draw tube border
            ctx.strokeStyle = isDarkMode ? '#374151' : '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw value on top of tube
            ctx.fillStyle = isDarkMode ? '#F3F4F6' : '#374151';
            ctx.font = 'bold 12px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText((mentor.completed_meetings_count || 0).toString(), x + barWidth / 2, y - 10);

            // Draw mentor name
            ctx.fillStyle = isDarkMode ? '#9CA3AF' : '#6B7280';
            ctx.font = '11px Inter, system-ui, sans-serif';
            ctx.fillText(mentor.name, x + barWidth / 2, rect.height - 50);
        });

        // Draw grid lines
        ctx.strokeStyle = isDarkMode ? '#374151' : '#E5E7EB';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = chartStartY + (i * chartHeight / 5);
            const value = Math.round(maxValue - (i * maxValue / 5));
            
            ctx.beginPath();
            ctx.moveTo(chartStartX - 10, y);
            ctx.lineTo(chartStartX + displayMentors.length * (barWidth + barSpacing) - barSpacing + 10, y);
            ctx.stroke();

            // Y-axis labels
            ctx.fillStyle = isDarkMode ? '#6B7280' : '#9CA3AF';
            ctx.font = '10px Inter, system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(value.toString(), chartStartX - 15, y + 4);
        }

    }, [displayMentors, isDarkMode]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sesi Pembelajaran per Mentor</h3>
                <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            
            <div className="w-full h-80">
                <canvas 
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ display: 'block' }}
                />
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Total Mentor: {displayMentors.length}</span>
                    <span>
                        Total Pertemuan: {displayMentors.reduce((sum, mentor) => sum + (mentor.completed_meetings_count || 0), 0)}
                    </span>
                </div>
            </div>
        </div>
    );
}
