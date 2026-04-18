"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

/**
 * Course-to-payment URL mapping.
 * Each slug maps to a course title and its external payment iframe source.
 * To add a new course, simply add a new entry here.
 */
const COURSE_CATALOG = {
    // Best Selling Courses
    "web-development-bootcamp-2026": {
        title: "The Complete 2026 Web Development Boot Camp Course",
        paymentUrl: "https://cjzgt.courses.store/407365?quick-pay=true",
    },
    "python-finance-data-analytics": {
        title: "Python for Finance: Investment Fundamentals & Data Analytics",
        paymentUrl: "https://cjzgt.courses.store/407365?quick-pay=true",
    },
    "machine-learning-python-r": {
        title: "Machine Learning A-Z™: Hands-On Python & R In Data Science",
        paymentUrl: "https://cjzgt.courses.store/407365?quick-pay=true",
    },
    "digital-marketing-complete": {
        title: "The Complete Digital Marketing Course - 12 Courses in 1",
        paymentUrl: "https://cjzgt.courses.store/407365?quick-pay=true",
    },
    // Recently Added Courses
    "ux-design-essentials": {
        title: "User Experience Design Essentials - Adobe XD UI UX Design",
        paymentUrl: "https://cjzgt.courses.store/407365?quick-pay=true",
    },
    "react-complete-guide": {
        title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
        paymentUrl: "https://cjzgt.courses.store/407365?quick-pay=true",
    },
    "financial-analyst-2026": {
        title: "The Complete Financial Analyst Course 2026",
        paymentUrl: "https://cjzgt.courses.store/407365?quick-pay=true",
    },
    "social-media-marketing": {
        title: "Social Media Marketing MASTERY | Learn Ads on 10+ Platforms",
        paymentUrl: "https://cjzgt.courses.store/407365?quick-pay=true",
    },
};

export default function CourseCheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const slug = params?.slug;
    const course = COURSE_CATALOG[slug];

    // If the slug doesn't match any course, show a friendly not-found state
    if (!course) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                        <span className="text-4xl">😕</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Course Not Found</h1>
                    <p className="text-gray-600 mb-8">
                        The course you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Checkout Header Bar */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-20 z-40">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
                    {/* Back Button + Course Title */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => router.back()}
                            className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-4 h-4 text-gray-700" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-sm md:text-base font-bold text-gray-900 truncate">
                                {course.title}
                            </h1>
                            <p className="text-xs text-gray-500 hidden sm:block">
                                Secure Checkout — Last Moment Tuitions
                            </p>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex-shrink-0 hidden sm:flex items-center gap-1.5 text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-semibold">Secure Payment</span>
                    </div>
                </div>
            </div>

            {/* Iframe Container */}
            <div className="relative" style={{ minHeight: 'calc(100vh - 160px)' }}>
                {/* Loading Spinner — visible until iframe loads */}
                {!iframeLoaded && (
                    <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center z-10 gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin" />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-700 font-semibold">Loading Payment Gateway...</p>
                            <p className="text-sm text-gray-500 mt-1">Please wait while we set up your secure checkout</p>
                        </div>
                    </div>
                )}

                <iframe
                    src={course.paymentUrl}
                    title={`Checkout — ${course.title}`}
                    className="w-full border-0"
                    style={{ minHeight: 'calc(100vh - 160px)' }}
                    onLoad={() => setIframeLoaded(true)}
                    allow="payment; clipboard-write"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </div>
    );
}
