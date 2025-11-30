import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Lock } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function AddScheduleModal({ isOpen, onClose, mentors, memberProfile }) {
    const [formData, setFormData] = useState({
        mentor_id: '',
        proposed_date: '',
        proposed_time: ''
    });
    const [errors, setErrors] = useState({});
    const [availableMentors, setAvailableMentors] = useState([]);
    const [loadingMentors, setLoadingMentors] = useState(false);
    const [timeConstraints, setTimeConstraints] = useState({ min: '', max: '', disabled: false });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.mentor_id || !formData.proposed_date || !formData.proposed_time) {
            setErrors({
                mentor_id: !formData.mentor_id ? 'Pilih mentor' : '',
                proposed_date: !formData.proposed_date ? 'Pilih tanggal' : '',
                proposed_time: !formData.proposed_time ? 'Pilih waktu' : ''
            });
            return;
        }

        // Combine date and time
        const dateTime = new Date(`${formData.proposed_date}T${formData.proposed_time}`);
        
        router.post(route('member.jadwal.store'), {
            mentor_id: formData.mentor_id,
            proposed_date: dateTime.toISOString().split('T')[0],
            proposed_time: formData.proposed_time
        }, {
            onSuccess: () => {
                onClose();
                setFormData({ mentor_id: '', proposed_date: '', proposed_time: '' });
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            }
        });
    };

    const handleClose = () => {
        onClose();
        setFormData({ mentor_id: '', proposed_date: '', proposed_time: '' });
        setErrors({});
        setAvailableMentors([]);
    };

    // Fetch available mentors when date and time are selected
    useEffect(() => {
        if (formData.proposed_date && formData.proposed_time) {
            setLoadingMentors(true);
            axios.get(route('member.jadwal.available-mentors'), {
                params: {
                    proposed_date: formData.proposed_date,
                    proposed_time: formData.proposed_time
                }
            })
            .then(response => {
                console.log('Available mentors response:', response.data);
                setAvailableMentors(response.data);
                // Reset mentor selection if current selection is not available
                if (formData.mentor_id && !response.data.find(m => m.id == formData.mentor_id)) {
                    setFormData(prev => ({ ...prev, mentor_id: '' }));
                }
            })
            .catch(error => {
                console.error('Error fetching available mentors:', error);
                setAvailableMentors([]);
            })
            .finally(() => {
                setLoadingMentors(false);
            });
        } else {
            setAvailableMentors([]);
        }
    }, [formData.proposed_date, formData.proposed_time]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Tambah Jadwal Baru
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Date Selection - First Priority */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Waktu/Tanggal
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={formData.proposed_date}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({ ...formData, proposed_date: value, mentor_id: '' });

                                    if (value) {
                                        const day = new Date(value).getDay(); // 0=Sun, 6=Sat
                                        if (day === 0) {
                                            setErrors(prev => ({
                                                ...prev,
                                                proposed_date: 'Hari Minggu tidak bisa dipilih. Silakan pilih hari Senin sampai Sabtu.',
                                            }));
                                            setTimeConstraints({ min: '', max: '', disabled: true });
                                        } else if (day === 6) {
                                            // Sabtu
                                            setErrors(prev => ({ ...prev, proposed_date: '' }));
                                            setTimeConstraints({ min: '08:30', max: '10:00', disabled: false });
                                        } else {
                                            // Senin - Jumat
                                            setErrors(prev => ({ ...prev, proposed_date: '' }));
                                            setTimeConstraints({ min: '08:30', max: '15:00', disabled: false });
                                        }
                                    } else {
                                        setTimeConstraints({ min: '', max: '', disabled: false });
                                    }
                                }}
                                min={new Date().toISOString().split('T')[0]}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                            <input
                                type="time"
                                value={formData.proposed_time}
                                onChange={(e) => setFormData({ ...formData, proposed_time: e.target.value, mentor_id: '' })}
                                min={timeConstraints.min || undefined}
                                max={timeConstraints.max || undefined}
                                disabled={timeConstraints.disabled}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        {(errors.proposed_date || errors.proposed_time) && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.proposed_date || errors.proposed_time}
                            </p>
                        )}
                    </div>

                    {/* Mentor Selection - Second Priority */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Nama Mentor
                        </label>
                        <select
                            value={formData.mentor_id}
                            onChange={(e) => setFormData({ ...formData, mentor_id: e.target.value })}
                            disabled={!formData.proposed_date || !formData.proposed_time || loadingMentors}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {loadingMentors ? 'Memuat mentor...' : 
                                 !formData.proposed_date || !formData.proposed_time ? 'Pilih tanggal dan waktu dulu' :
                                 availableMentors.length === 0 ? 'Tidak ada mentor tersedia' :
                                 'Pilih Mentor'}
                            </option>
                            {availableMentors.map((mentor) => (
                                <option key={mentor.id} value={mentor.id}>
                                    {mentor.name} {mentor.specializations && mentor.specializations.length > 0 && `(${mentor.specializations.join(', ')})`}
                                </option>
                            ))}
                        </select>
                        {errors.mentor_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.mentor_id}</p>
                        )}
                        {formData.proposed_date && formData.proposed_time && availableMentors.length === 0 && !loadingMentors && (
                            <p className="text-orange-500 text-sm mt-1">
                                Tidak ada mentor yang tersedia dengan spesialisasi "{memberProfile?.training_type}" pada hari dan waktu tersebut
                            </p>
                        )}
                    </div>

                    {/* Meeting Type (Read Only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Lock className="w-4 h-4 inline mr-2" />
                            Jenis Pertemuan
                        </label>
                        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400">
                            {memberProfile?.meeting_type || 'Luring'} (Tidak dapat diubah)
                        </div>
                    </div>

                    {/* Training Type (Read Only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Lock className="w-4 h-4 inline mr-2" />
                            Jenis Pelatihan
                        </label>
                        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400">
                            {memberProfile?.training_type || 'Administrasi Perkantoran'} (Tidak dapat diubah)
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                        >
                            Simpan Jadwal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

