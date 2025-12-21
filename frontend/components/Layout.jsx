'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, User, Search } from 'lucide-react';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();

        // Listen for storage changes (handles logouts/logins in other tabs or same tab manual triggers)
        window.addEventListener('storage', checkUser);
        window.addEventListener('authChange', checkUser);

        return () => {
            window.removeEventListener('storage', checkUser);
            window.removeEventListener('authChange', checkUser);
        };
    }, [pathname]);

    const navItems = [
        { label: 'Home', href: '/' },
        {
            label: 'Government',
            href: '/government',
            children: [
                { label: 'SSC', href: '/government/ssc' },
                { label: 'Railways', href: '/government/railways' }
            ]
        },
        {
            label: 'Engineering',
            href: '/engineering',
            children: [
                { label: 'Computer', href: '/engineering/computer' },
                { label: 'Mechanical', href: '/engineering/mechanical' }
            ]
        },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo - Updated to match image */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                            <img src="/logo.png" alt="LMT" className="w-8 h-8 object-contain" />
                        </div>
                        <span className="font-bold text-xl text-gray-900 tracking-tight">Last Moment Tuitions</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {/* Search Bar - Based on image */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="What do you want to learn..."
                                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>

                        {navItems.map((item) => (
                            <div key={item.label} className="relative group">
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors py-2"
                                >
                                    {item.label}
                                    {item.children && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />}
                                </Link>

                                {item.children && (
                                    <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 translate-y-2 transition-all duration-200 p-2">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                className="block px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="pl-4 border-l border-gray-200 flex items-center gap-4">
                            {user ? (
                                <Link href="/profile" className="flex items-center gap-2 group">
                                    <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold border border-primary-100 group-hover:bg-primary-100 transition-colors">
                                        <User size={20} />
                                    </div>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                                        Sign in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        Create Account
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}

import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Button } from './ui';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold mb-2">Start learning with 67.1k</h2>
                        <h2 className="text-3xl font-bold mb-6">students around the world.</h2>
                        <div className="flex gap-4">
                            <Button variant="primary" className="rounded-md px-6">Join the Family</Button>
                            <Button variant="outline" className="rounded-md px-6 border-gray-700 text-white hover:bg-gray-800">Browse Course</Button>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-end gap-12">
                        <div className="text-center md:text-left">
                            <div className="text-3xl font-bold mb-1">6.3k</div>
                            <div className="text-sm text-gray-400">Online Courses</div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-3xl font-bold mb-1">26k</div>
                            <div className="text-sm text-gray-400">Certified Instructor</div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-3xl font-bold mb-1">99.9%</div>
                            <div className="text-sm text-gray-400">Success Rate</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-gray-800 pt-16">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                                <img src="https://play-lh.googleusercontent.com/APeEZa4FLR80Q2huR4dQmpElLaBz_jw7kkkpFF38Kjm6Y_ehZjg3XIqH_8Vvo0WZBg" alt="LMT Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xl font-bold text-white">Last Moment Tuitions</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Aliquam rhoncus ligula est, vel facilisis ligula tincidunt ac. Vivamus et sem ac nulla tincidunt.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Become Instructor</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Career</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">FAQs</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Terms & Condition</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Download App</h4>
                        <div className="space-y-4">
                            <Link href="#" className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors w-full">
                                <span className="text-2xl"></span>
                                <div className="text-left">
                                    <div className="text-xs text-gray-400">Download on the</div>
                                    <div className="text-sm font-bold">App Store</div>
                                </div>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors w-full">
                                <span className="text-2xl">▶</span>
                                <div className="text-left">
                                    <div className="text-xs text-gray-400">Get it on</div>
                                    <div className="text-sm font-bold">Google Play</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2024 E-tutor. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">English</Link>
                        <Link href="#" className="hover:text-white transition-colors">USD</Link>
                    </div>
                </div>
            </div >
        </footer >
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
