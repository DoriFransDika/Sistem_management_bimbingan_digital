import React from 'react';

export default function ReviewSection() {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Ringkasan Ulasan</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium mb-4 transition-colors">
                Buat Ringkasan Ulasan
            </button>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Ringkasan :</strong></p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                    Ulasan tersebut menyoroti efektivitas mentor yang sangat 
                    membantu dan sabar, dengan penjelasan yang mudah 
                    dipahami oleh peserta didik. Rating rata-rata: 4.5/5
                </p>
            </div>
        </div>
    );
}