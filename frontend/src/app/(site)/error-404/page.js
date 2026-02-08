"use client";

import Link from 'next/link';
import { Button } from '@/components/ui';

export default function Error404Page() {
    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center bg-white p-6 md:p-12 pt-32 md:pt-40 font-sans overflow-hidden">
            <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

                {/* Text Content - Fixed Grammar and Layout */}
                <div className="w-full lg:w-[45%] text-center lg:text-left flex flex-col items-center lg:items-start">

                    {/* Header Group */}
                    <div className="relative mb-6">
                        {/* Background Ghost Text - Balanced alignment */}
                        <div className="text-[56px] md:text-[110px] font-bold text-[#F1F5F9] leading-none select-none tracking-tight">
                            Error 404
                        </div>

                        {/* Main Heading - Clear without overlap issues */}
                        <h1 className="text-[32px] md:text-[52px] font-bold text-[#1D2939] leading-tight mt-[-20px] md:mt-[-45px] relative z-10">
                            Oops! page not found
                        </h1>
                    </div>

                    {/* Description - Fixed Grammar/Professional Tone */}
                    <p className="text-[#667085] text-base md:text-xl max-w-md leading-relaxed mb-10 font-medium">
                        Oops! It looks like the page you requested could not be found.
                        It might have been moved or deleted. Let's get you back on track safely.
                    </p>

                    {/* Action Button */}
                    <div className="pt-2">
                        <Button
                            asChild
                            className="bg-[#FF6B00] hover:bg-[#E65F00] text-white px-10 py-4 h-auto rounded-xl text-sm font-bold shadow-lg shadow-orange-500/10 transition-all hover:scale-105 active:scale-95"
                        >
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>

                {/* Right Side: Clean Illustration (Fixed asset issue) */}
                <div className="w-full lg:w-[55%] relative flex justify-center items-center">
                    <div className="relative w-full max-w-lg">
                        {/* Subtle decorative glow behind the character */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-50 to-accent-50 rounded-full blur-3xl opacity-50 scale-90"></div>

                        <img
                            src="/assets/clean_404_character.png"
                            alt="404 Error Illustration"
                            className="w-full h-auto drop-shadow-2xl animate-float relative z-10"
                            onError={(e) => {
                                // High-quality fallback if image fails
                                e.target.src = 'https://illustrations.popsy.co/gray/confusing-person.svg';
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="mt-24 text-center text-gray-400 text-[10px] font-medium border-t border-gray-50 pt-8 w-full uppercase tracking-widest">
                © 2026 - Last Moment Tuitions. All rights reserved
            </div>
        </div>
    );
}
