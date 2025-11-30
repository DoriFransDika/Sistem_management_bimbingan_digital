import { Head, Link } from '@inertiajs/react';
import React from 'react';
import Navbar from '../../Components/Welcome/Navbar';
import Beranda from '../../Components/Welcome/Beranda';
import Fitur from '../../Components/Welcome/Fitur';
import Footer from '../../Components/Welcome/Footer';
import FAQ from '../../Components/Welcome/FAQ';

export default function Welcome(props) {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-blue-950 text-white min-h-screen">
                <div className="relative w-full">
                    <Navbar auth={props.auth} />
                    <Beranda />
                </div>
                <Fitur />
                <FAQ />
                <Footer auth={props.auth} />
            </div>
        </>
    );
}