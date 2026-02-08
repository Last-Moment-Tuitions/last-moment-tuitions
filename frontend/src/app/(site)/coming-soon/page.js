"use client";

import { useState, useEffect } from 'react';
import { Mail, Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export default function ComingSoonPage() {
    // Countdown Timer Logic
    const [timeLeft, setTimeLeft] = useState({ days: 29, hours: 23, mins: 59, secs: 59 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
                if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const TimeUnit = ({ value, label }) => (
        <div className="bg-[#F2F4F7] rounded-xl p-4 md:p-6 text-center min-w-[80px] md:min-w-[100px] border border-gray-100 transition-all hover:translate-y-[-4px]">
            <div className="text-3xl md:text-4xl font-bold text-[#1D2939]">{String(value).padStart(2, '0')}</div>
            <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</div>
        </div>
    );

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center bg-white p-6 md:p-12 font-sans overflow-hidden">
            <main className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

                {/* Left Side: Content matched with reference */}
                <div className="w-full lg:w-1/2 space-y-8 animate-slide-up text-center lg:text-left">
                    <div className="inline-block px-4 py-1.5 bg-orange-50 text-[#FF6B00] text-xs font-black uppercase tracking-widest rounded-full">
                        Coming Soon
                    </div>

                    <h1 className="text-4xl md:text-7xl font-bold text-[#1D2939] leading-tight tracking-tight">
                        We are launching our new website very soon. Stay tuned!
                    </h1>

                    {/* Timer Section */}
                    <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                        <TimeUnit value={timeLeft.days} label="Days" />
                        <TimeUnit value={timeLeft.hours} label="Hours" />
                        <TimeUnit value={timeLeft.mins} label="Mins" />
                        <TimeUnit value={timeLeft.secs} label="Sec" />
                    </div>
                </div>

                {/* Right Side: Illustration & Form */}
                <div className="w-full lg:w-[45%] flex flex-col items-center">
                    <div className="relative w-full max-w-md mb-12">
                        <img
                            src="/assets/clean_coming_soon.png"
                            alt="Coming Soon Illustration"
                            className="w-full h-auto drop-shadow-2xl animate-float"
                            onError={(e) => {
                                e.target.src = 'https://illustrations.popsy.co/gray/success.svg';
                            }}
                        />
                    </div>

                    {/* Notify Card - Clean style */}
                    <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl border border-gray-50 text-center lg:text-left">
                        <h3 className="text-xl font-bold text-[#1D2939] mb-5">
                            Get notified when we launch
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    className="pl-12 h-12 rounded-lg border-gray-100 bg-gray-50/50"
                                    placeholder="Email address"
                                />
                            </div>
                            <Button className="bg-[#FF6B00] hover:bg-[#E65F00] text-white h-12 px-8 rounded-lg font-bold transition-all text-sm">
                                Notify Me
                            </Button>
                        </div>
                        <p className="text-gray-400 text-xs mt-5 italic opacity-80">
                            *Don't worry we will not spam you 😉
                        </p>
                    </div>
                </div>
            </main>

            {/* Social & Footer from reference style */}
            <div className="mt-20 flex flex-col items-center gap-6 w-full opacity-60">
                <div className="flex items-center gap-6 text-gray-500">
                    <Facebook className="w-5 h-5 cursor-pointer hover:text-[#FF6B00]" />
                    <Twitter className="w-5 h-5 cursor-pointer hover:text-[#FF6B00]" />
                    <Youtube className="w-5 h-5 cursor-pointer hover:text-[#FF6B00]" />
                    <Instagram className="w-5 h-5 cursor-pointer hover:text-[#FF6B00]" />
                </div>
                <div className="text-center text-gray-400 text-[10px] font-medium border-t border-gray-50 pt-6 w-full">
                    © 2026 - Last Moment Tuitions. All rights reserved
                </div>
            </div>
        </div>
    );
}
