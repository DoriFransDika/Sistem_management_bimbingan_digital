import React from 'react';
import { Star, Trophy, Award } from 'lucide-react';

export default function MentorRatings({ mentors = [] }) {
    // Default data jika tidak ada data mentors
    const defaultMentors = [
        { id: 1, name: 'Rahman', average_rating: 4.8, ratings_count: 12 },
        { id: 2, name: 'Asep', average_rating: 4.6, ratings_count: 8 },
        { id: 3, name: 'Sari', average_rating: 4.4, ratings_count: 6 },
        { id: 4, name: 'dori', average_rating: 4.2, ratings_count: 4 }
    ];

    const displayMentors = mentors && mentors.length > 0 ? mentors : defaultMentors;

    // Sort mentors by rating (highest first)
    const sortedMentors = [...displayMentors].sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        return Array.from({ length: 5 }, (_, index) => {
            if (index < fullStars) {
                return <Star key={index} className="w-4 h-4 text-yellow-400 fill-yellow-400" />;
            } else if (index === fullStars && hasHalfStar) {
                return <Star key={index} className="w-4 h-4 text-yellow-400 fill-yellow-400 opacity-50" />;
            } else {
                return <Star key={index} className="w-4 h-4 text-gray-300 fill-gray-300" />;
            }
        });
    };

    const getRankIcon = (index) => {
        switch (index) {
            case 0:
                return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 1:
                return <Award className="w-5 h-5 text-gray-400" />;
            case 2:
                return <Award className="w-5 h-5 text-orange-500" />;
            default:
                return <span className="text-sm font-bold text-gray-500">#{index + 1}</span>;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Rating Mentor</h3>
                <Star className="w-5 h-5 text-yellow-500" />
            </div>
            
            <div className="space-y-3">
                {sortedMentors.slice(0, 5).map((mentor, index) => (
                    <div key={mentor.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700' :
                        index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700 dark:to-slate-700 border border-gray-200 dark:border-gray-600' :
                        index === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-700' :
                        'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}>
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 mr-3">
                                {getRankIcon(index)}
                            </div>
                            <div className="bg-gradient-to-br from-indigo-500 to-teal-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                {mentor.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-white">
                                    {mentor.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {mentor.ratings_count || 0} ulasan
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <div className="flex items-center mr-2">
                                {renderStars(mentor.average_rating || 0)}
                            </div>
                            <span className="text-sm font-bold text-gray-800 dark:text-white">
                                {mentor.average_rating ? mentor.average_rating.toFixed(1) : '0.0'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Total Mentor: {displayMentors.length}</span>
                    <span>
                        Rata-rata: {(displayMentors.reduce((sum, mentor) => sum + (mentor.average_rating || 0), 0) / displayMentors.length).toFixed(1)}
                    </span>
                </div>
            </div>
        </div>
    );
}
