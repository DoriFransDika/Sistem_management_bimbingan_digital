import React, { useState } from 'react';
import { Star, MessageSquare, User, X, Filter, Search } from 'lucide-react';

export default function RecentReviews({ reviews = [] }) {
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [filterRating, setFilterRating] = useState('');
    const [filterTraining, setFilterTraining] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Default data jika tidak ada data reviews
    const defaultReviews = [
        {
            id: 1,
            member_name: 'Andini',
            mentor_name: 'Asep',
            rating: 5,
            comment: 'Mentor sangat membantu dan sabar dalam menjelaskan materi.',
            created_at: '2 jam yang lalu',
            training_type: 'Web Programming Basic'
        },
        {
            id: 2,
            member_name: 'Budi',
            mentor_name: 'dori',
            rating: 4,
            comment: 'Penjelasan mudah dipahami, sangat recommended!',
            created_at: '5 jam yang lalu',
            training_type: 'Graphic Design'
        },
        {
            id: 3,
            member_name: 'Citra',
            mentor_name: 'Rahman',
            rating: 5,
            comment: 'Sesi pembelajaran sangat efektif dan menyenangkan.',
            created_at: '1 hari yang lalu',
            training_type: 'UI/UX Design'
        },
        {
            id: 4,
            member_name: 'Dedi',
            mentor_name: 'Sari',
            rating: 3,
            comment: 'Materi cukup baik, tapi perlu lebih detail.',
            created_at: '2 hari yang lalu',
            training_type: 'Administrasi Perkantoran'
        },
        {
            id: 5,
            member_name: 'Eka',
            mentor_name: 'Asep',
            rating: 5,
            comment: 'Excellent! Mentor sangat profesional dan berpengalaman.',
            created_at: '3 hari yang lalu',
            training_type: 'Web Programming Basic'
        },
        {
            id: 6,
            member_name: 'Fina',
            mentor_name: 'Rahman',
            rating: 4,
            comment: 'Sangat membantu untuk memahami konsep dasar.',
            created_at: '4 hari yang lalu',
            training_type: 'UI/UX Design'
        }
    ];

    const allReviews = reviews && reviews.length > 0 ? reviews : defaultReviews;
    const displayReviews = allReviews.slice(0, 3);

    // Filter reviews
    const filteredReviews = allReviews.filter(review => {
        // Convert both to numbers for proper comparison (handles float from backend)
        const matchesRating = !filterRating || Number(review.rating) === Number(filterRating);
        const matchesTraining = !filterTraining || review.training_type === filterTraining;
        const matchesSearch = !searchTerm || 
            review.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.mentor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesRating && matchesTraining && matchesSearch;
    });

    const renderStars = (rating) => {
        const ratingNum = Number(rating); // Ensure rating is a number
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${
                    index < ratingNum
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 fill-gray-300'
                }`}
            />
        ));
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Ulasan Terbaru</h3>
                <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {displayReviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                    {review.member_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                                        {review.member_name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        untuk {review.mentor_name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                {renderStars(review.rating)}
                            </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                            "{review.comment}"
                        </p>
                        
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            {review.created_at}
                        </p>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                    onClick={() => setShowAllReviews(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                    Lihat Semua Ulasan →
                </button>
            </div>

            {/* Modal All Reviews */}
            {showAllReviews && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 relative">
                            <button 
                                onClick={() => setShowAllReviews(false)}
                                className="absolute right-4 top-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="flex items-center">
                                <MessageSquare className="w-8 h-8 mr-3" />
                                <div>
                                    <h2 className="text-2xl font-bold">Semua Ulasan</h2>
                                    <p className="text-blue-100">Total {filteredReviews.length} ulasan</p>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Cari ulasan..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                {/* Filter Rating */}
                                <select
                                    value={filterRating}
                                    onChange={(e) => setFilterRating(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Semua Rating</option>
                                    <option value="5">5 Bintang</option>
                                    <option value="4">4 Bintang</option>
                                    <option value="3">3 Bintang</option>
                                    <option value="2">2 Bintang</option>
                                    <option value="1">1 Bintang</option>
                                </select>

                                {/* Filter Training */}
                                <select
                                    value={filterTraining}
                                    onChange={(e) => setFilterTraining(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Semua Pelatihan</option>
                                    <option value="Web Programming Basic">Web Programming Basic</option>
                                    <option value="Graphic Design">Graphic Design</option>
                                    <option value="UI/UX Design">UI/UX Design</option>
                                    <option value="Administrasi Perkantoran">Administrasi Perkantoran</option>
                                </select>

                                {/* Clear Filters */}
                                <button
                                    onClick={() => {
                                        setFilterRating('');
                                        setFilterTraining('');
                                        setSearchTerm('');
                                    }}
                                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Filter className="w-4 h-4" />
                                    Reset Filter
                                </button>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="p-6 max-h-96 overflow-y-auto">
                            <div className="space-y-4">
                                {filteredReviews.map((review) => (
                                    <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center">
                                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                                    {review.member_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                                                        {review.member_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        untuk {review.mentor_name} • {review.training_type}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                                            "{review.comment}"
                                        </p>
                                        
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            {review.created_at}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {filteredReviews.length === 0 && (
                                <div className="text-center py-8">
                                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">Tidak ada ulasan yang sesuai dengan filter</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
