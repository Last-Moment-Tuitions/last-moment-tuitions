'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, Star, Download, FileText, MessageSquare,
    Share2, MoreVertical, ThumbsUp, ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { Button, Badge } from '@/components/ui';
import VideoPlayer from '@/components/VideoPlayer';
import CurriculumSidebar from '@/components/CurriculumSidebar';

// --- RICH MOCK DATA FOR LESSON VIEW ---
// --- MOCK DATA STORE ---
const COURSE_LESSONS = {
    'l1': {
        id: 'l1',
        type: 'video',
        title: "1. What is Webflow?",
        description: "Introduction to the Webflow interface and core concepts.",
        duration: "07:31",
        lastUpdated: "Oct 26, 2024",
        comments: 154,
        studentsWatching: 512,
        videoUrl: "76979871",
        resources: [
            { name: "Create account on webflow.pdf", size: "12.6 MB" }
        ]
    },
    'l2': {
        id: 'l2',
        type: 'note',
        title: "2. Sign up in Webflow (Notes)",
        description: "Step-by-step guide to creating your account and setting up the workspace.",
        duration: "10 min read",
        lastUpdated: "Oct 27, 2024",
        comments: 42,
        studentsWatching: 120,
        contentUrl: "/dummy-notes.html", // Path to our dummy html
        resources: []
    }
};

const SIDEBAR_DATA = [
    {
        id: 's1',
        title: "Getting Started",
        lectures: 4,
        duration: "51m",
        items: [
            { id: 'l1', title: "What is Webflow?", duration: "07:31", type: 'video', completed: true },
            { id: 'l2', title: "Sign up in Webflow", duration: "10 min", type: 'note', completed: false }, // Note type
            { id: 'l3', title: "Teaser of Webflow", duration: "07:31", type: 'video', completed: false, locked: true },
            { id: 'l4', title: "Figma Introduction", duration: "07:31", type: 'video', completed: false, locked: true },
        ]
    },
    {
        id: 's2',
        title: "Secret of Good Design",
        lectures: 52,
        duration: "5m 49m",
        items: [
            { id: 'l5', title: "Understanding Typography", duration: "12:00", type: 'video', locked: true },
        ]
    }
];

const MOCK_REVIEWS = [
    {
        id: 1,
        user: "Ronald Richards",
        date: "1 week ago",
        rating: 5,
        comment: "Maecenas risus tortor, tincidunt nec purus eu, gravida suscipit tortor. Aliquam rhoncus ligula est, non pulvinar elit convallis nec.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ronald",
        replies: []
    },
    {
        id: 2,
        user: "Kristin Watson",
        date: "2 weeks ago",
        rating: 5,
        comment: "Nullam non quam a lectus finibus varius nec a orci. Aliquam efficitur sem cursus elit efficitur lacinia.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kristin",
        replies: [
            {
                user: "Arlene McCoy",
                date: "1 week ago",
                comment: "Thank you so much sir, you're a great mentor. 🔥🔥🔥"
            }
        ]
    }
];

// Mock instructor data (since it's no longer part of COURSE_LESSONS)
const MOCK_INSTRUCTOR = {
    name: "Vako Shvili",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    subscribers: "236,568"
};


export default function LessonPage({ params }) {
    // Unwrap params using React.use() for Next.js 15+ Client Components
    const { lectureId } = React.use(params);
    // Safely handling if lectureId is not in our mock
    const currentLesson = COURSE_LESSONS[lectureId] || COURSE_LESSONS['l1'];

    // Construct the full content object expected by UI
    const courseContent = {
        ...currentLesson,
        curriculum: SIDEBAR_DATA,
        reviews: MOCK_REVIEWS
    };

    // State for Maximize Mode
    const [isMaximized, setIsMaximized] = useState(false);
    // Removed isBlurry state for direct DOM speed
    const containerRef = React.useRef(null);
    const overlayRef = React.useRef(null);
    const iframeRef = React.useRef(null);

    // Handle Fullscreen Logic
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Sync state with fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsMaximized(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Security: Ultra-Fast Direct DOM Blackout with 1s Cooldown
    useEffect(() => {
        let hideTimeout;

        const handleKeyDown = (e) => {
            // Trigger on PrintScreen or Cmd+Shift
            if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey)) {
                // Cancel any pending hide - user is trying again
                clearTimeout(hideTimeout);

                // Direct DOM manipulation for zero latency
                if (overlayRef.current) overlayRef.current.style.display = 'flex';
                if (iframeRef.current) iframeRef.current.style.opacity = '0';
            }
        };

        const handleKeyUp = (e) => {
            // Restore ONLY if safe keys are released
            if (!e.metaKey && !e.shiftKey && e.key !== 'PrintScreen') {
                // Add 1 second cooldown before revealing
                hideTimeout = setTimeout(() => {
                    if (overlayRef.current) overlayRef.current.style.display = 'none';
                    if (iframeRef.current) iframeRef.current.style.opacity = '1';
                }, 1000);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Disable Right Click
        const handleContextMenu = (e) => e.preventDefault();
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            clearTimeout(hideTimeout);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);


    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="bg-white min-h-screen font-sans text-gray-900 select-none print:hidden">
            <style jsx global>{`
                @media print {
                    body { display: none !important; }
                }
            `}</style>

            {/* --- Main Grid Layout --- */}
            <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] overflow-hidden">

                {/* LEFT COLUMN: Main Content */}
                {/* Conditional Overflow: 'auto' for video (scrollable page), 'hidden' for notes (iframe scrolls itself) */}
                <div className={`flex-1 flex flex-col h-full relative ${currentLesson.type === 'video' ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'}`}>

                    {/* TOP ACTION BAR - ONLY SHOW FOR VIDEO */}
                    {currentLesson.type === 'video' && (
                        <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md shrink-0 z-10">
                            <div className="flex items-center gap-4">
                                <Link href="/courses/1" className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
                                    <ChevronLeft size={20} />
                                </Link>
                                <div>
                                    <h1 className="text-sm text-gray-400 font-medium">Full Stack Web Development</h1>
                                    <h2 className="text-base font-semibold truncate max-w-md">{currentLesson.title}</h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">

                                <Button size="sm" className="hidden sm:flex bg-primary-600 hover:bg-primary-700 text-white border-0">
                                    Mark as Complete
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* CONTENT AREA: Video or Note Viewer */}
                    <div className="w-full bg-black relative group flex-1 flex flex-col">
                        {currentLesson.type === 'video' ? (
                            <div className="max-w-[1200px] mx-auto w-full">
                                <VideoPlayer title={currentLesson.title} videoId={currentLesson.videoUrl} />
                            </div>
                        ) : (
                            /* NOTE VIEWER MODE - Full Width */
                            <div ref={containerRef} className="bg-white w-full h-full relative overflow-hidden flex flex-col">

                                {/* Floating Maximize Button */}
                                <button
                                    onClick={toggleFullScreen}
                                    className="absolute top-4 right-4 z-50 bg-gray-900/10 hover:bg-gray-900/80 text-gray-600 hover:text-white p-2 rounded-full backdrop-blur-sm transition-all"
                                    title={isMaximized ? "Exit Full Screen" : "Full Screen"}
                                >
                                    {isMaximized ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" /><path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                                    )}
                                </button>

                                {/* 1. Tiled Watermark Overlay */}
                                <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.03] overflow-hidden flex flex-wrap content-start select-none">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="w-[300px] h-[300px] flex items-center justify-center -rotate-45 transform">
                                            <span className="text-3xl font-bold text-black">adwait@lmt.com</span>
                                        </div>
                                    ))}
                                </div>

                                {/* 2. Security Overlay (Ref-controlled) */}
                                <div
                                    ref={overlayRef}
                                    style={{ display: 'none' }} // Hidden by default, toggled via Ref
                                    className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm items-center justify-center select-none flex-col"
                                >
                                    <div className="text-4xl mb-2">🔒</div>
                                    <h3 className="text-xl font-bold text-gray-800">Security Mode Active</h3>
                                    <p className="text-gray-500 mt-1">Screenshot disabled</p>
                                </div>

                                {/* 3. Actual HTML Content iFrame */}
                                <iframe
                                    ref={iframeRef}
                                    src={currentLesson.contentUrl}
                                    className="w-full h-full block bg-white border-none"
                                    title="Lesson Notes"
                                />
                            </div>
                        )}
                    </div>

                    {/* Content Container */}
                    <div className="max-w-[1000px] mx-auto px-4 lg:px-8 py-8 space-y-8 pb-20">

                        {/* Lesson Title & Actions */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{currentLesson.title}</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="flex -space-x-2">
                                        {/* Student Avatars */}
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                                        ))}
                                    </div>
                                    <span className="font-semibold text-gray-900">{currentLesson.studentsWatching}</span>
                                    <span>students watching</span>
                                    <span className="mx-2">•</span>
                                    <span>Last updated: {currentLesson.lastUpdated}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <ThumbsUp size={16} /> Like
                                </Button>

                                <Button variant="ghost" size="icon">
                                    <MoreVertical size={18} />
                                </Button>
                            </div>
                        </div>

                        {/* Instructor Info */}
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <img src={MOCK_INSTRUCTOR.image} className="w-12 h-12 rounded-full object-cover" alt="Instructor" />
                                <div>
                                    <h4 className="font-bold text-gray-900">{MOCK_INSTRUCTOR.name}</h4>
                                    <span className="text-sm text-gray-500">{MOCK_INSTRUCTOR.subscribers} Subscribers</span>
                                </div>
                            </div>
                            <Button>Subscribe</Button>
                        </div>

                        {/* Tabs Panel */}
                        <div>
                            <div className="flex items-center border-b border-gray-200 mb-6">
                                {['Overview', 'Notes', 'Comments'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-800'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* TAB CONTENT: Overview */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <h3 className="text-xl font-bold mb-3">Lectures Description</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                            {currentLesson.description}
                                        </p>
                                    </div>

                                    {/* Attachments */}
                                    {currentLesson.resources.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold mb-3">Attach Files ({currentLesson.resources.length})</h3>
                                            <div className="grid gap-4">
                                                {currentLesson.resources.map((file, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-primary-50 border border-primary-100 p-4 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-primary-500 shadow-sm">
                                                                <FileText size={20} />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{file.name}</div>
                                                                <div className="text-xs text-gray-500">{file.size}</div>
                                                            </div>
                                                        </div>
                                                        <Button size="sm" className="gap-2">
                                                            <Download size={16} /> Download
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB CONTENT: Comments */}
                            {activeTab === 'comments' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h3 className="text-xl font-bold mb-4">Comments ({currentLesson.comments})</h3>
                                    {courseContent.reviews.map(review => (
                                        <div key={review.id} className="flex gap-4">
                                            <img src={review.avatar} className="w-10 h-10 rounded-full bg-gray-100" />
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm">{review.user}</h4>
                                                        <span className="text-xs text-gray-500">{review.date}</span>
                                                    </div>
                                                    <div className="flex text-amber-400">
                                                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm">{review.comment}</p>

                                                {/* Replies */}
                                                {review.replies.map((reply, i) => (
                                                    <div key={i} className="flex gap-4 mt-4 pl-4 border-l-2 border-gray-100">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                                                        <div>
                                                            <h5 className="font-bold text-xs">{reply.user} <span className="text-gray-400 font-normal ml-2">{reply.date}</span></h5>
                                                            <p className="text-gray-600 text-xs mt-1">{reply.comment}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* TAB CONTENT: Notes (Placeholder) */}
                            {activeTab === 'notes' && (
                                <div className="text-center py-10 text-gray-500 animate-fade-in">
                                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>You haven't taken any notes for this lesson yet.</p>
                                    <Button variant="outline" className="mt-4">Create New Note</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Sidebar */}
                <div className="w-full lg:w-[400px] shrink-0 h-full border-l border-gray-200 bg-white overflow-hidden">
                    <CurriculumSidebar curriculum={courseContent.curriculum} currentLectureId={lectureId || 'l1'} />
                </div>

            </div>
        </div>
    );
}
