'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Stethoscope, Cog, BriefcaseBusiness, GraduationCap } from 'lucide-react';

import { ChevronDown, Search } from 'lucide-react';

export function Header() {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;
    const isGroupActive = (paths) => paths.some(path => pathname?.startsWith(path));

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm font-sans">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">

                {/* Left Section: Logo & Search */}
                <div className="flex items-center gap-4 xl:gap-8">
                    {/* Logo & Branding */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                            <img
                                src="https://play-lh.googleusercontent.com/APeEZa4FLR80Q2huR4dQmpElLaBz_jw7kkkpFF38Kjm6Y_ehZjg3XIqH_8Vvo0WZBg"
                                alt="Last Moment Tuitions Logo"
                                className="w-full h-full object-cover"
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

                    <NavDropdown
                        label="Government"
                        active={isGroupActive(['/government'])}
                        items={[
                            { label: 'SEBI Grade A IT Officer', href: '/government/sebi-grade-a-it' },
                            { label: 'IBPS SO', href: '/government/ibps-so' }
                        ]}
                    />

                    <NavDropdown
                        label="Engineering"
                        active={isGroupActive(['/exams/jee', '/exams/gate'])}
                        items={[
                            { label: 'JEE Mains', href: '/exams/jee' },
                            { label: 'JEE Advanced', href: '/exams/jee' },
                            { label: 'GATE', href: '/exams/gate' },
                            { label: 'BITSAT', href: '/exams/jee' }
                        ]}
                    />


                </ul>

                {/* Right Section: Auth Buttons */}
                <div className="hidden md:flex items-center gap-3 xl:gap-4">
                    <Link href="/login" className="text-gray-700 font-semibold hover:text-primary-600 transition-colors text-sm whitespace-nowrap">Sign in</Link>
                    <Button variant="primary" className="rounded-full px-5 py-2 text-sm font-bold shadow-lg shadow-primary-500/20 whitespace-nowrap">Create Account</Button>
                </div>
            </div>
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
