"use client";

import Link from 'next/link';

export default function Error404Page() {
    return (
        <div
            className="flex flex-col w-full min-h-screen lg:h-screen bg-white overflow-hidden font-inter text-[#1D2026]"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* ── Main Content ── */}
            <main
                className="flex-1 flex flex-col lg:flex-row items-center justify-center w-full px-6 lg:px-[8%] py-12 lg:py-0 gap-6 lg:gap-8 xl:gap-12"
            >

                {/* LEFT: Contents Block */}
                <div
                    className="flex flex-col items-center lg:items-start p-0 gap-5 lg:gap-6 w-full lg:w-[350px] xl:w-[400px] lg:shrink-0 z-[2] order-2 lg:order-1 text-center lg:text-left"
                >

                    {/* Heading Block */}
                    <div className="flex flex-col items-center lg:items-start p-0 gap-2 lg:gap-3 w-full">

                        {/* Error 404 */}
                        <div
                            className="text-[#E9EAF0] font-semibold text-4xl lg:text-5xl xl:text-[64px] leading-none tracking-[-0.02em]"
                        >
                            Error 404
                        </div>

                        {/* Oops! page not found */}
                        <div
                            className="font-semibold text-lg lg:text-xl xl:text-[32px] leading-tight tracking-[-0.01em] w-full"
                        >
                            Oops! page not found
                        </div>
                    </div>

                    {/* Description Text */}
                    <div
                        className="text-[#4E5566] font-normal text-sm lg:text-base xl:text-[16px] leading-relaxed lg:leading-[26px] w-full"
                    >
                        Something went wrong. It&apos;s look that your requested could not be found. It&apos;s look like the link is broken or the page is removed.
                    </div>

                    {/* Buttons btn */}
                    <Link
                        href="/"
                        className="flex flex-row justify-center items-center px-6 gap-3 w-[140px] h-12 bg-[#FF6636] hover:bg-[#E05D31] transition-colors duration-200 no-underline rounded-sm"
                    >
                        <span className="font-semibold text-base leading-none tracking-[-0.01em] text-white text-center whitespace-nowrap">
                            Go Back
                        </span>
                    </Link>
                </div>

                {/* RIGHT: Illustration Area */}
                <div
                    className="flex-1 w-full h-[400px] sm:h-[500px] lg:h-[95%] xl:h-full z-[1] order-1 lg:order-2 bg-no-repeat bg-contain bg-center lg:bg-right transition-all duration-300"
                    style={{
                        backgroundImage: 'url(/assets/404_3d.png)',
                    }}
                >
                </div>

            </main>
        </div>
    );
}
