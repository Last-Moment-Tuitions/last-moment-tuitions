'use client';
import React from 'react';
import { Header, Footer } from '@/components/Layout';
import { StickyBanner } from '@/components/StickyBanner';

export default function SiteLayoutClient({ children, initialMenu }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <StickyBanner sticky={false} className="relative">
                🎉 <span className="font-bold">New Year Sale!</span> Get 50% off on all courses. Use code: <span className="font-bold">NEWYear2025</span>
            </StickyBanner>
            <Header initialMenu={initialMenu} />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
