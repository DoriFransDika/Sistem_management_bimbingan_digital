import Checkbox from '@/Components/Login/Checkbox';
import InputError from '@/Components/Login/InputError';
import InputLabel from '@/Components/Login/InputLabel';
import PrimaryButton from '@/Components/Login/PrimaryButton';
import TextInput from '@/Components/Login/TextInput';
import ApplicationLogo from '@/Components/Login/ApplicationLogo';
import GuestLayout from '@/Pages/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            
            <div className="flex w-full max-w-6xl rounded-2xl overflow-hidden shadow-xl">
                {/* Left Column - Advertisement Section */}
                <div className="flex-1 bg-gradient-to-br from-blue-400 to-slate-50 flex items-center justify-center p-8">
                    <div className="text-center">
                        <img 
                            src="/img/iklan.png" 
                            alt="Advertisement" 
                            className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
                        />
                        {/* Pagination indicators */}
                        <div className="flex justify-center space-x-2 mt-4">
                            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Login Section */}
                <div className="flex-1 bg-white flex flex-col items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        {/* Branding */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-blue-800 mb-1">MEDIATAMA WEB INDONESIA</h1>
                            <p className="text-lg text-blue-600">Training Center</p>
                        </div>

                        {/* Login Form */}
                        <div className="bg-white rounded-xl p-8 shadow-lg border border-blue-100">
                            {/* Logo Section */}
                            <div className="text-center mb-6">
                                <ApplicationLogo className="h-16 w-16 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-blue-800">Masuk ke Akun</h2>
                            </div>

                            {status && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="text-sm font-medium text-green-700">
                                        {status}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="email" value="Email" className="text-blue-700 font-medium" />

                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />

                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="Password" className="text-blue-700 font-medium" />

                                    <div className="relative">
                                        <TextInput
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={data.password}
                                            className="mt-1 block w-full pr-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="block">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData('remember', e.target.checked)
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ms-2 text-sm text-blue-600">
                                            Remember me
                                        </span>
                                    </label>
                                </div>

                                <div className="flex items-center justify-end">
                                    <PrimaryButton 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200" 
                                        disabled={processing}
                                    >
                                        Log in
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
