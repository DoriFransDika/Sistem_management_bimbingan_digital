import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function LastReview({ review }) {
    if (!review) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Belum ada ulasan
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                    <blockquote className="text-gray-700 dark:text-gray-300 italic mb-2">
                        "{review.comment || 'Sesi terakhir sangat membantu! Penjelasannya mudah dipahami.'}"
                    </blockquote>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        - Untuk mentor {review.mentor_name || 'Tiara C'}
                    </p>
                </div>
            </div>
        </div>
    );
};




















