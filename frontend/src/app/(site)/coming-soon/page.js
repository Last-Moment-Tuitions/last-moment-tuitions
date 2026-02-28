"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Importing Image component
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

    const boxStyle = {
        width: '100px',
        height: '100px',
        background: '#F5F7FA',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '4px',
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            color: '#1D2026',
            overflowX: 'hidden'
        }}>
            {/* Main Content */}
            <main style={{
                flex: 1,
                display: 'flex',
                padding: '0 10%',
                alignItems: 'center',
                position: 'relative',
                height: '100vh'
            }}>
                {/* Left Side */}
                <div style={{ width: '45%', zIndex: 2, marginTop: '-60px' }}>
                    <span style={{ color: '#FF6636', fontWeight: '600', fontSize: '14px', letterSpacing: '0.1em', marginBottom: '16px', display: 'block' }}>COMING SOON</span>
                    <h1 style={{ fontSize: '56px', fontWeight: '700', lineHeight: '1.1', marginBottom: '40px', color: '#1D2026' }}>
                        We are going to launch our website very soon. Stay tune
                    </h1>

                    {/* Countdown */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={boxStyle}>
                            <span style={{ fontSize: '32px', fontWeight: '700' }}>{timeLeft.days}</span>
                            <span style={{ fontSize: '14px', color: '#4E5566' }}>Days</span>
                        </div>
                        <div style={boxStyle}>
                            <span style={{ fontSize: '32px', fontWeight: '700' }}>{timeLeft.hours}</span>
                            <span style={{ fontSize: '14px', color: '#4E5566' }}>Hours</span>
                        </div>
                        <div style={boxStyle}>
                            <span style={{ fontSize: '32px', fontWeight: '700' }}>{timeLeft.minutes}</span>
                            <span style={{ fontSize: '14px', color: '#4E5566' }}>Mins</span>
                        </div>
                        <div style={boxStyle}>
                            <span style={{ fontSize: '32px', fontWeight: '700' }}>{timeLeft.seconds}</span>
                            <span style={{ fontSize: '14px', color: '#4E5566' }}>Sec</span>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div style={{ width: '55%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    {/* Character Illustration using the imported/defined source */}
                    <div style={{ position: 'relative', width: '100%', height: '80%', display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={comingSoonIllustration}
                            alt="Coming Soon Character"
                            style={{
                                height: '100%',
                                width: 'auto',
                                objectFit: 'contain',
                                transform: 'translate(50px, -95px)' // Nudged slightly more upward as requested
                            }}
                        />
                    </div>

                    {/* Notification Card (Exact Figma Specs) */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '32px',
                        gap: '24px',
                        position: 'absolute',
                        width: '648px',
                        height: '222px',
                        right: '0', // Using right 0 and relative bottom for better responsiveness
                        bottom: '50px',
                        background: '#FFFFFF',
                        boxShadow: '0px 16px 80px rgba(0, 0, 0, 0.12)',
                        zIndex: 10,
                        boxSizing: 'border-box'
                    }}>
                        {/* Get notified when we launch heading */}
                        <div style={{
                            width: '584px',
                            height: '32px',
                            fontFamily: "'Inter', sans-serif",
                            fontStyle: 'normal',
                            fontWeight: '600',
                            fontSize: '24px',
                            lineHeight: '32px',
                            letterSpacing: '-0.01em',
                            color: '#1D2026',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0
                        }}>
                            Get notified when we launch
                        </div>

                        {/* Input Field & Button Row */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            padding: '0px',
                            gap: '16px',
                            width: '583px',
                            height: '56px',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0
                        }}>
                            {/* Input Field Container */}
                            <div style={{
                                position: 'relative',
                                width: '420px',
                                height: '56px',
                                boxSizing: 'border-box',
                                flex: 'none',
                                order: 0,
                                flexGrow: 0
                            }}>
                                <Mail
                                    size={24}
                                    style={{
                                        position: 'absolute',
                                        left: '20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#FF6636' // Primary orange as per vector border spec
                                    }}
                                />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        padding: '0px 20px 0px 56px',
                                        background: '#FFFFFF',
                                        border: '1px solid #E9EAF0',
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: '400',
                                        fontSize: '16px',
                                        lineHeight: '24px',
                                        color: '#1D2026',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Notify Me Button */}
                            <button style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '0px 32px',
                                gap: '12px',
                                width: '147px',
                                height: '56px',
                                background: '#FF6636',
                                border: 'none',
                                cursor: 'pointer',
                                flex: 'none',
                                order: 1,
                                flexGrow: 0,
                                transition: 'background 0.2s ease'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#E05D31'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#FF6636'}
                            >
                                <span style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontStyle: 'normal',
                                    fontWeight: '600',
                                    fontSize: '18px',
                                    lineHeight: '56px',
                                    letterSpacing: '-0.01em',
                                    textTransform: 'capitalize',
                                    color: '#FFFFFF'
                                }}>
                                    Notify Me
                                </span>
                            </button>
                        </div>

                        {/* Spam protection text */}
                        <div style={{
                            width: '239px',
                            height: '22px',
                            fontFamily: "'Inter', sans-serif",
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: '14px',
                            lineHeight: '22px',
                            letterSpacing: '-0.01em',
                            color: '#4E5566',
                            flex: 'none',
                            order: 2,
                            flexGrow: 0
                        }}>
                            *Don&apos;t worry we will not spam you 😀
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
