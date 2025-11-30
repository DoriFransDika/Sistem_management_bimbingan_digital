import ApplicationLogo from '@/Components/Login/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-blue-100 p-24 flex items-center justify-center">
            {children}
        </div>
    );
}
