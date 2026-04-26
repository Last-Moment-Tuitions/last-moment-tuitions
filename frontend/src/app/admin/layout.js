'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useEffect, useState } from 'react';
import {
    LayoutDashboard, PlusCircle, Layers, CreditCard,
    MessageCircle, Settings, LogOut, GraduationCap,
    CircleUser,
    Star,
    Loader2,
    BookOpen, FileText, LayoutTemplate, Menu
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const { toast } = useToast();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

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
        { name: 'My Courses', href: '/admin/courses', icon: BookOpen },
        { name: 'Pages', href: '/admin/pages', icon: FileText },
        { name: 'Templates', href: '/admin/templates', icon: LayoutTemplate },
        { name: 'Menus', href: '/admin/menus', icon: Menu },
        // { name: 'Earning', href: '/admin/earnings', icon: CreditCard },
        // { name: 'Message', href: '/admin/messages', icon: MessageCircle, badge: 2 },
        { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    if (loading || !isAuthorized) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>;
    }

    // Editor has its own full-screen layout, skip the admin shell
    if (pathname.startsWith('/admin/editor')) {
        return children;
    }

    return (
        <div className="flex min-h-screen bg-[#F5F7FA] font-sans text-gray-900">
            {/* Sidebar - Figma Width 280px */}
            <aside className="w-[280px] bg-[#1D2026] text-white flex flex-col shrink-0 transition-all duration-300 fixed h-full z-30">
                {/* Logo Area */}
                <div className="h-[70px] flex items-center px-6 border-b border-[#363B47]">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 bg-white rounded-full border border-[#363B47] shadow-sm group-hover:border-primary-500/50 transition-all duration-300 shrink-0 overflow-hidden relative">
                            <img
                                src="https://play-lh.googleusercontent.com/APeEZa4FLR80Q2huR4dQmpElLaBz_jw7kkkpFF38Kjm6Y_ehZjg3XIqH_8Vvo0WZBg"
                                alt="Last Moment Tuitions Logo"
                                className="absolute w-[155%] h-[155%] max-w-none"
                                style={{ 
                                    left: "50%", 
                                    top: "50%", 
                                    transform: "translate(-50%, -46%)",
                                    objectFit: "cover"
                                }}
                            />
                        </div>
                        <span className="text-[17px] font-extrabold text-white tracking-tight truncate">
                            Last Moment Tuitions
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 space-y-1 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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


            </aside>

            {/* Main Content Wrapper - Offset for fixed sidebar */}
            <div className="flex-1 ml-[280px] w-[calc(100%-280px)]">
                {/* Top Header with User Info and Logout */}
                <header className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-end px-8 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-700">
                            Hello, {user?.firstName || 'Admin'}
                        </span>
                        <button
                            onClick={async () => {
                                setLoggingOut(true);
                                await logout(() => toast.success('Logged out successfully'));
                            }}
                            disabled={loggingOut}
                            className="rounded-full px-5 py-2 text-sm font-bold shadow-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed border border-primary-500 text-primary-600 bg-transparent hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                            {loggingOut ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                                    Logging out...
                                </>
                            ) : (
                                'Logout'
                            )}
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
