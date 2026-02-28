"use client";

import Link from 'next/link';

export default function Error404Page() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100vh',
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* ── Main Content ── */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start', // Start from left to use exact padding
                alignItems: 'center',
                width: '100%',
                padding: '0px 0px 0px 8%',
                gap: '112px', // EXACT FIGMA GAP
            }}>

                {/* LEFT: Contents Block */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '32px', // Gap between text blocks and button
                    width: '534px',
                    height: '364px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                    zIndex: 2
                }}>

                    {/* Heading Block */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px',
                        gap: '16px',
                        width: '534px',
                        height: '148px',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0
                    }}>

                        {/* Error 404 */}
                        <div style={{
                            width: '358px',
                            height: '80px',
                            fontFamily: "'Inter', sans-serif",
                            fontStyle: 'normal',
                            fontWeight: '600',
                            fontSize: '80px',
                            lineHeight: '80px',
                            letterSpacing: '-0.02em',
                            color: '#E9EAF0',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0
                        }}>
                            Error 404
                        </div>

                        {/* Oops! page not found */}
                        <div style={{
                            width: '100%',
                            height: '52px',
                            fontFamily: "'Inter', sans-serif",
                            fontStyle: 'normal',
                            fontWeight: '600',
                            fontSize: '48px',
                            lineHeight: '52px',
                            letterSpacing: '-0.02em',
                            color: '#1D2026',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0
                        }}>
                            Oops! page not found
                        </div>
                    </div>

                    {/* Description Text */}
                    <div style={{
                        width: '100%',
                        height: '96px',
                        fontFamily: "'Inter', sans-serif",
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: '20px',
                        lineHeight: '32px',
                        color: '#4E5566',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0
                    }}>
                        Something went wrong. It&apos;s look that your requested could not be found. It&apos;s look like the link is broken or the page is removed.
                    </div>

                    {/* Buttons btn */}
                    <Link
                        href="/"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '0px 24px', // Slightly reduced padding to give text more room
                            gap: '12px',
                            width: '160px', // Increased width to fit "Go Back"
                            height: '56px',
                            background: '#FF6636',
                            borderRadius: '0px',
                            textDecoration: 'none',
                            flex: 'none',
                            order: 2,
                            flexGrow: 0,
                            transition: 'background 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#E05D31'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#FF6636'}
                    >
                        <span style={{
                            width: 'auto',
                            height: 'auto',
                            fontFamily: "'Inter', sans-serif",
                            fontStyle: 'normal',
                            fontWeight: '600',
                            fontSize: '18px',
                            lineHeight: '1', // Better centering
                            letterSpacing: '-0.01em',
                            textTransform: 'none',
                            color: '#FFFFFF',
                            textAlign: 'center',
                            whiteSpace: 'nowrap' // Prevent text from wrapping/cutting
                        }}>
                            Go Back
                        </span>
                    </Link>
                </div>

                {/* RIGHT: Illustration Area - Fills remaining space and touches right edge */}
                <div style={{
                    flex: 1,
                    height: '100%',
                    backgroundImage: 'url(/assets/404_3d.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right center',
                    zIndex: 1
                }}>
                </div>
            </main>
        </div>
    );
}
