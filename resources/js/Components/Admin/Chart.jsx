import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../Contexts/ThemeContext';

export default function Chart({ meetings = [] }) {
    const canvasRef = useRef(null);
    const { isDarkMode } = useTheme();

    // Default data jika tidak ada data meetings
    const defaultData = {
        selesai: 65,
        terdaftar: 40,
        berlangsung: 85
    };

    // Process meetings data dari backend atau gunakan default
    const processedData = meetings && Object.keys(meetings).length > 0 
        ? meetings
        : defaultData;

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

        // Chart configuration
        const chartData = [
            { label: 'Selesai', value: processedData.selesai, color: '#10B981' },
            { label: 'Terdaftar', value: processedData.terdaftar, color: '#3B82F6' },
            { label: 'Berlangsung', value: processedData.berlangsung, color: '#F59E0B' }
        ];

        const total = chartData.reduce((sum, item) => sum + item.value, 0);
        if (total === 0) return;

        // Pie chart configuration with more spacing
        const padding = 80; // Increased padding for labels
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const radius = Math.min(centerX, centerY) - 30;
        let currentAngle = -Math.PI / 2; // Start from top

        // Draw pie slices
        chartData.forEach((data, index) => {
            const sliceAngle = (data.value / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = data.color;
            ctx.fill();

            // Draw slice border
            ctx.strokeStyle = isDarkMode ? '#374151' : '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw label with much more spacing to prevent clipping
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelDistance = radius + 50; // Increased from 35 to 50
            const labelX = centerX + Math.cos(labelAngle) * labelDistance;
            const labelY = centerY + Math.sin(labelAngle) * labelDistance;
            
            // Ensure labels stay within bounds
            const safeLabelX = Math.max(20, Math.min(rect.width - 20, labelX));
            const safeLabelY = Math.max(20, Math.min(rect.height - 20, labelY));
            
            ctx.fillStyle = isDarkMode ? '#F3F4F6' : '#374151';
            ctx.font = '12px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.label, safeLabelX, safeLabelY);
            
            // Draw value with increased spacing
            ctx.font = 'bold 11px Inter, system-ui, sans-serif';
            ctx.fillText(`${data.value}`, safeLabelX, safeLabelY + 20); // Increased from 18 to 20

            currentAngle += sliceAngle;
        });

        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
        ctx.fillStyle = isDarkMode ? '#374151' : '#F9FAFB';
        ctx.fill();
        ctx.strokeStyle = isDarkMode ? '#4B5563' : '#E5E7EB';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw total in center with increased spacing
        ctx.fillStyle = isDarkMode ? '#F3F4F6' : '#374151';
        ctx.font = 'bold 16px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Total', centerX, centerY - 8); // Increased from -5 to -8
        ctx.font = 'bold 20px Inter, system-ui, sans-serif';
        ctx.fillText(total.toString(), centerX, centerY + 18); // Increased from 15 to 18

    }, [processedData, isDarkMode]);


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Status Pertemuan</h3>
            <div className="w-full h-80">
                <canvas 
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ display: 'block' }}
                />
            </div>
        </div>
    );
}