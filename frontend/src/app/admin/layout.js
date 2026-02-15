'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import {
    LayoutDashboard, PlusCircle, Layers, CreditCard,
    MessageCircle, Settings, LogOut, GraduationCap,
    CircleUser,
    Star
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user || !user.roles || !user.roles.includes('admin')) {
                router.push('/'); // Or /signin
            } else {
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);


    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Create New Course', href: '/admin/courses/create', icon: PlusCircle },
        { name: 'My Courses', href: '/admin/courses', icon: Layers },
        { name: 'Pages', href: '/admin/pages', icon: Layers },
        { name: 'Menus', href: '/admin/menus', icon: Layers },
        { name: 'Earning', href: '/admin/earnings', icon: CreditCard },
        { name: 'Message', href: '/admin/messages', icon: MessageCircle, badge: 2 },
        { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    if (loading || !isAuthorized) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>;
    }

    return (
        <div className="flex min-h-screen bg-[#F5F7FA] font-sans text-gray-900">
            {/* Sidebar - Figma Width 280px */}
            <aside className="w-[280px] bg-[#1D2026] text-white flex flex-col shrink-0 transition-all duration-300 fixed h-full z-30">
                {/* Logo Area */}
                <div className="h-[70px] flex items-center px-6 border-b border-[#363B47]">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary-600 rounded">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-semibold tracking-tight">E-tutor</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        // Exact match for dashboard, startsWith for others to handle subpages
                        const isActive = item.href === '/admin'
                            ? pathname === '/admin'
                            : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all
                                    ${isActive
                                        ? 'bg-primary-600 text-white shadow-[inset_4px_0_0_0_white]' // Using Primary Blue instead of Orange #FF6636
                                        : 'text-[#8C94A3] hover:bg-[#363B47] hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#8C94A3] group-hover:text-white'}`} />
                                <span>{item.name}</span>
                                {item.badge && (
                                    <span className="ml-auto bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign Out (Fixed at bottom like Figma) */}
                <div className="p-6 border-t border-[#363B47]">
                    <button className="flex items-center gap-3 w-full text-[#8C94A3] hover:text-white transition-colors text-sm font-medium">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper - Offset for fixed sidebar */}
            <div className="flex-1 ml-[280px] w-[calc(100%-280px)]">
                {/* Top Header Placeholder if needed globally, but Dashboard has its own. 
                     The layout just renders children. */}
                <main className="min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
