import { Header, Footer } from '@/components/Layout';
import { StickyBanner } from '@/components/StickyBanner';

export default function SiteLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <StickyBanner>
                🎉 <span className="font-bold">New Year Sale!</span> Get 50% off on all courses. Use code: <span className="font-bold">NEWYear2025</span>
            </StickyBanner>
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
