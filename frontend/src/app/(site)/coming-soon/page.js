"use client";

import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

// Path pointing to your public folder
const comingSoonIllustration = "/assets/coming_soon_3d.png";

export default function ComingSoonPage() {
    const [timeLeft, setTimeLeft] = useState({
        days: 29,
        hours: 23,
        minutes: 59,
        seconds: 59
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const boxStyleClass = "w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 xl:w-[85px] xl:h-[85px] bg-[#F5F7FA] flex flex-col justify-center items-center rounded-sm transition-all";

    return (
        <div className="min-h-screen flex flex-col bg-white font-inter text-[#1D2026] overflow-x-hidden">
            {/* Main Content */}
            <main className="flex-1 flex flex-col lg:flex-row px-6 md:px-12 lg:px-[8%] xl:px-[10%] items-center justify-center lg:justify-between relative min-h-screen lg:h-screen py-6 lg:py-0 gap-4 xl:gap-16">

                {/* Left Side Text Content */}
                <div className="w-full lg:w-[350px] xl:w-[400px] z-[2] lg:-mt-[60px] text-center lg:text-left order-1 mb-2 lg:mb-0">
                    <span className="text-[#FF6636] font-semibold text-xs tracking-[0.1em] mb-3 block uppercase leading-none">COMING SOON</span>
                    <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-[40px] font-light lg:leading-[1.1] mb-4 xl:mb-8 text-[#1D2026]">
                        We are going to launch our website very soon. Stay tune
                    </h1>

                    {/* Countdown */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-3">
                        <div className={boxStyleClass}>
                            <span className="text-base sm:text-xl lg:text-[24px] font-bold">{timeLeft.days}</span>
                            <span className="text-[10px] sm:text-xs xl:text-[12px] text-[#4E5566]">Days</span>
                        </div>
                        <div className={boxStyleClass}>
                            <span className="text-base sm:text-xl lg:text-[24px] font-bold">{timeLeft.hours}</span>
                            <span className="text-[10px] sm:text-xs xl:text-[12px] text-[#4E5566]">Hours</span>
                        </div>
                        <div className={boxStyleClass}>
                            <span className="text-base sm:text-xl lg:text-[24px] font-bold">{timeLeft.minutes}</span>
                            <span className="text-[10px] sm:text-xs xl:text-[12px] text-[#4E5566]">Mins</span>
                        </div>
                        <div className={boxStyleClass}>
                            <span className="text-base sm:text-xl lg:text-[24px] font-bold">{timeLeft.seconds}</span>
                            <span className="text-[10px] sm:text-xs xl:text-[12px] text-[#4E5566]">Sec</span>
                        </div>
                    </div>
                </div>

                {/* Center (Mobile) / Right (Desktop) Illustration - Hidden on Mobile */}
                <div className="hidden lg:flex flex-1 w-full h-[280px] sm:h-[400px] lg:h-[95%] xl:h-[105%] flex-col justify-center items-center relative order-2 lg:mb-0">
                    <div className="relative w-full h-full flex justify-center items-center lg:items-start transition-all">
                        <img
                            src={comingSoonIllustration}
                            alt="Coming Soon Character"
                            className="h-full w-auto object-contain transform lg:translate-x-[30px] lg:translate-y-[-60px] transition-all duration-300"
                        />
                    </div>

                    {/* Notification Card (Desktop only) */}
                    <div className="hidden lg:flex flex-col items-start px-10 py-7 gap-4 absolute w-full max-w-[580px] right-0 bottom-[5%] bg-white shadow-[0px_32px_96px_rgba(0,0,0,0.1)] z-[10] box-border transition-all rounded-sm">
                        <div className="w-full font-bold text-xl leading-none tracking-[-0.01em] text-[#1D2026]">
                            Get notified when we launch
                        </div>
                        <div className="flex flex-row items-center gap-3 w-full h-11">
                            <div className="relative flex-1 h-full">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6331]" />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full h-full pl-11 pr-4 bg-white border border-[#E9EAF0] font-normal text-sm text-[#4E5566] outline-none rounded-sm transition-all focus:border-[#FF6331]"
                                />
                            </div>
                            <button className="flex flex-row justify-center items-center px-8 h-full bg-[#FF6331] hover:bg-[#E05228] transition-all duration-200 border-none cursor-pointer rounded-sm">
                                <span className="font-semibold text-sm tracking-[-0.01em] text-white">
                                    Notify Me
                                </span>
                            </button>
                        </div>
                        <div className="font-normal text-[11px] tracking-[-0.01em] text-[#8C94A3]">
                            *Don&apos;t worry we will not spam you 😃
                        </div>
                    </div>
                </div>

                {/* Bottom (Mobile only) Notification Form - Styled as Card */}
                <div className="flex lg:hidden flex-col items-start w-full max-w-[450px] bg-white shadow-[0px_20px_50px_rgba(0,0,0,0.1)] rounded-sm px-6 py-6 gap-4 order-3 mb-10 mx-auto mt-8 relative z-10">
                    <div className="w-full font-bold text-lg leading-none tracking-[-0.01em] text-[#1D2026]">
                        Get notified when we launch
                    </div>
                    <div className="flex flex-row items-center gap-2 w-full h-11">
                        <div className="relative flex-1 h-full">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF6331]" />
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full h-full pl-9 pr-2 bg-white border border-[#E9EAF0] text-sm text-[#4E5566] outline-none rounded-sm focus:border-[#FF6331]"
                            />
                        </div>
                        <button className="flex flex-row justify-center items-center px-4 h-full bg-[#FF6331] text-white font-semibold text-sm rounded-sm">
                            Notify Me
                        </button>
                    </div>
                    <div className="text-[10px] text-[#8C94A3]">*Don&apos;t worry we will not spam you 😃</div>
                </div>

            </main>
        </div>
    );
}
