'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Stethoscope, Cog, BriefcaseBusiness, GraduationCap, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useActiveMenu } from '@/hooks/api/useMenus';

import { ChevronDown, Search, Menu, X } from 'lucide-react';

export function Header() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const { data: activeMenu } = useActiveMenu();
    const navItems = activeMenu?.items || [];
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const isActive = (path) => pathname === path;
    const isGroupActive = (items) => items.some(item => pathname === item.href);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm font-sans">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">

                {/* Left Section: Logo & Search */}
                <div className="flex items-center gap-4 xl:gap-8">
                    {/* Logo & Branding */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
                        <div className="w-11 h-11 bg-white rounded-full border-[1.5px] border-black shadow-sm shrink-0 overflow-hidden relative">
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
                        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">
                            Last Moment Tuitions
                        </h1>
                    </Link>

                    {/* Search Bar - Visible on Desktop */}
                    <div className="hidden xl:block relative w-64 2xl:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="What do you want to learn..."
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Center Section: Navigation */}
                <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
                    <NavLink href="/" active={isActive('/')}>
                        Home
                    </NavLink>

                    {navItems.map((item, idx) => (
                        item.type === 'link' ? (
                            <NavLink key={idx} href={item.href} active={isActive(item.href)}>
                                {item.label}
                            </NavLink>
                        ) : (
                            <NavDropdown
                                key={idx}
                                label={item.label}
                                active={isGroupActive(item.items)}
                                items={item.items}
                            />
                        )
                    ))}

                    <NavLink href="/courses" active={isActive('/courses')}>
                        Courses
                    </NavLink>
                </ul>

                {/* Right Section: Auth Buttons */}
                <div className="hidden md:flex items-center gap-3 xl:gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-700">
                                Hello, {user.firstName || 'User'}
                            </span>
                            <Button
                                onClick={() => {
                                    setLoggingOut(true);
                                    logout(() => toast.success('Logged out successfully'));
                                }}
                                disabled={loggingOut}
                                variant="outline"
                                className="rounded-full px-5 py-2 text-sm font-bold shadow-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loggingOut ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                                        Logging out...
                                    </>
                                ) : (
                                    'Logout'
                                )}
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link href="/signin" className="text-gray-700 font-semibold hover:text-primary-600 transition-colors text-sm whitespace-nowrap">Sign in</Link>
                            <Button href="/signup" variant="primary" className="rounded-full px-5 py-2 text-sm font-bold shadow-lg shadow-primary-500/20 whitespace-nowrap">Create Account</Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-6 flex flex-col gap-4 max-h-[calc(100vh-80px)] overflow-y-auto">
                    {/* Search Bar Mobile */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-primary-500"
                        />
                    </div>

                    <nav className="flex flex-col gap-2">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            Home
                        </Link>

                        {navItems.map((item, idx) => (
                            <div key={idx} className="flex flex-col">
                                {item.type === 'link' ? (
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.href) ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <div className="px-4 py-3">
                                        <span className="text-sm font-semibold text-gray-900 block mb-2">{item.label}</span>
                                        <div className="pl-4 flex flex-col gap-2 border-l-2 border-gray-100">
                                            {item.items.map((subItem, subIdx) => (
                                                <Link
                                                    key={subIdx}
                                                    href={subItem.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="text-sm text-gray-600 hover:text-primary-600 py-1"
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <Link
                            href="/courses"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('/courses') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            Courses
                        </Link>
                    </nav>

                    <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                        {user ? (
                            <>
                                <div className="px-4 py-2 text-sm text-gray-600">
                                    Signed in as <span className="font-semibold text-gray-900">{user.firstName}</span>
                                </div>
                                <Button onClick={() => { logout(); setIsMobileMenuOpen(false); }} variant="outline" className="w-full justify-center">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg">
                                    Sign in
                                </Link>
                                <Button href="/signup" onClick={() => setIsMobileMenuOpen(false)} variant="primary" className="w-full justify-center">
                                    Create Account
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

function NavLink({ href, active, children }) {
    return (
        <li>
            <Link
                href={href}
                className={`
          flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
          ${active
                        ? 'text-primary-600 bg-gradient-to-br from-primary-50 to-accent-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                    }
        `}
            >
                {children}
            </Link>
        </li>
    );
}

function NavDropdown({ label, active, items }) {
    return (
        <li className="relative group">
            <button
                className={`
                    flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${active
                        ? 'text-primary-600 bg-gradient-to-br from-primary-50 to-accent-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                    }
                `}
            >
                {label}
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
            </button>

            <div className="absolute left-0 top-full pt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform group-hover:translate-y-0 translate-y-1">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-1">
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors whitespace-nowrap"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </li>
    );
}

import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MessageCircle } from 'lucide-react';
import { Button } from './ui';

export function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-300 pt-12 pb-6 mt-auto relative overflow-hidden border-t border-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Background glowing effects for premium feel */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 xl:gap-8">
                    {/* Brand & Socials */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-white rounded-full border-[1.5px] border-gray-900 shadow-xl shrink-0 overflow-hidden relative group">
                                <img
                                    src="https://play-lh.googleusercontent.com/APeEZa4FLR80Q2huR4dQmpElLaBz_jw7kkkpFF38Kjm6Y_ehZjg3XIqH_8Vvo0WZBg"
                                    alt="Last Moment Tuitions Logo"
                                    className="absolute w-[155%] h-[155%] max-w-none transition-transform duration-300 group-hover:scale-[1.65]"
                                    style={{ 
                                        left: "50%", 
                                        top: "50%", 
                                        transform: "translate(-50%, -46%)",
                                        objectFit: "cover"
                                    }}
                                />
                            </div>
                            <span className="text-xl font-extrabold text-white tracking-tight">
                                Last Moment Tuitions
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Empowering students with high-quality, practical learning. From engineering to placements, we help you ace your exams and career with ease.
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start">
                            <a href="mailto:lastmomenttuitions@gmail.com" className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-[5px] flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-primary-500/25">
                                <Mail className="w-4 h-4" />
                            </a>
                            <a href="https://wa.me/+917038604912" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-[5px] flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 shadow-sm hover:shadow-[#25D366]/25">
                                <MessageCircle className="w-4 h-4" />
                            </a>
                            <a href="https://www.instagram.com/lastmomenttuition" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-[5px] flex items-center justify-center text-gray-400 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-pink-500/25">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="https://www.linkedin.com/in/last-moment-tuitions/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-[5px] flex items-center justify-center text-gray-400 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all duration-300 shadow-sm hover:shadow-[#0A66C2]/25">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="https://www.youtube.com/@Lastmomenttuitions" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-[5px] flex items-center justify-center text-gray-400 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all duration-300 shadow-sm hover:shadow-[#FF0000]/25">
                                <Youtube className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Group */}
                    <div className="lg:col-span-5 flex justify-center w-full">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-8 text-center w-full xl:w-11/12 lg:mx-auto">
                            <div className="space-y-5">
                                <h4 className="text-white font-bold tracking-wide uppercase text-[10px] sm:text-xs">Courses</h4>
                                <ul className="space-y-3">
                                    {['Engineering', 'Placement', 'Company', 'Entrance', 'Government'].map((item) => (
                                        <li key={item}>
                                            <Link href="#" className="text-xs sm:text-sm text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-transform duration-200">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-5">
                                <h4 className="text-white font-bold tracking-wide uppercase text-[10px] sm:text-xs">Company</h4>
                                <ul className="space-y-3">
                                    {['About', 'Team', 'Blog'].map((item) => (
                                        <li key={item}>
                                            <Link href="#" className="text-xs sm:text-sm text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-transform duration-200">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-5">
                                <h4 className="text-white font-bold tracking-wide uppercase text-[10px] sm:text-xs">Support</h4>
                                <ul className="space-y-3">
                                    {['Help Center', 'FAQs', 'Contact'].map((item) => (
                                        <li key={item}>
                                            <Link href="#" className="text-xs sm:text-sm text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-transform duration-200">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-5 hidden sm:block">
                                <h4 className="text-white font-bold tracking-wide uppercase text-[10px] sm:text-xs">Legal</h4>
                                <ul className="space-y-3">
                                    {['Terms', 'Privacy', 'Refund'].map((item) => (
                                        <li key={item}>
                                            <Link href="#" className="text-xs sm:text-sm text-gray-400 hover:text-primary-400 hover:translate-x-1 inline-block transition-transform duration-200">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* App Download */}
                    <div className="lg:col-span-3 flex flex-col items-center lg:items-end w-full">
                        <div className="space-y-6 w-full sm:max-w-xs xl:max-w-[220px]">
                            <h4 className="text-white font-bold tracking-wide uppercase text-xs text-center lg:text-center w-full">Download our App</h4>
                            <div className="flex flex-row lg:flex-col gap-3 justify-center lg:justify-center w-full">
                                <a
                                    href="https://apps.apple.com/in/iphone/search?term=last%20moment%20tuitions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center lg:justify-start gap-4 bg-gray-900 border border-gray-800 px-4 lg:px-6 py-3 rounded-xl hover:bg-gray-800 hover:border-gray-700 transition-all duration-300 w-full lg:w-[200px] flex-1 lg:flex-none group shadow-sm hover:shadow-primary-500/10 mx-auto"
                                >
                                    <svg viewBox="0 0 384 512" className="w-6 h-6 lg:w-7 lg:h-7 text-white group-hover:scale-105 transition-transform shrink-0" fill="currentColor">
                                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                    </svg>
                                    <div className="flex flex-col text-left overflow-hidden">
                                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium leading-none mb-1">Download on</span>
                                        <span className="text-xs lg:text-sm font-semibold text-white leading-none whitespace-nowrap">App Store</span>
                                    </div>
                                </a>

                                <a
                                    href="https://play.google.com/store/apps/details?id=co.jones.cjzgt&hl=en_IN"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center lg:justify-start gap-4 bg-gray-900 border border-gray-800 px-4 lg:px-6 py-3 rounded-xl hover:bg-gray-800 hover:border-gray-700 transition-all duration-300 w-full lg:w-[200px] flex-1 lg:flex-none group shadow-sm hover:shadow-primary-500/10 mx-auto"
                                >
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Play Store Icon" className="w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-105 transition-transform shrink-0" />
                                    <div className="flex flex-col text-left overflow-hidden">
                                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium leading-none mb-1">Get it on</span>
                                        <span className="text-xs lg:text-sm font-semibold text-white leading-none whitespace-nowrap">Play Store</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-900 mt-4 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p className="flex items-center gap-1">© {new Date().getFullYear()} Last Moment Tuitions. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }) {
    return (
        <li>
            <Link
                href={href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
            >
                {children}
            </Link>
        </li>
    );
}

export function Breadcrumb({ items }) {
    return (
        <nav className="flex items-center gap-2 py-4 text-sm text-gray-600">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span className="text-gray-400">/</span>}
                    {item.href ? (
                        <Link href={item.href} className="hover:text-primary-600 transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}
