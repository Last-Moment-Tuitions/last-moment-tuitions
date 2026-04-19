'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronLeft, Star, Download, FileText, MessageSquare,
    Share2, MoreVertical, ThumbsUp, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button, Badge } from '@/components/ui';
import CurriculumSidebar from '@/components/CurriculumSidebar';
import { coursesApi } from '@/services/courses.api';
import { useAuth } from '@/context/AuthContext';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Helper: find a lesson node by ID in the recursive curriculum tree
function findLessonInTree(nodes, lessonId) {
    if (!nodes) return null;
    for (const node of nodes) {
        if (node.id === lessonId) return node;
        if (node.children) {
            const found = findLessonInTree(node.children, lessonId);
            if (found) return found;
        }
    }
    return null;
}

// Helper: get first lesson (file) in tree
function getFirstLesson(nodes) {
    if (!nodes) return null;
    for (const node of nodes) {
        if (node.type === 'file') return node;
        if (node.children) {
            const found = getFirstLesson(node.children);
            if (found) return found;
        }
    }
    return null;
}

// Helper: format seconds → "MM:SS"
function formatDuration(seconds) {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Render video content based on URL type
function VideoContent({ url, title }) {
    if (!url) {
        return (
            <div className="w-full aspect-video bg-gray-900 flex items-center justify-center text-gray-500">
                <p>No video content available</p>
            </div>
        );
    }

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else {
            videoId = url.split('v=')[1]?.split('&')[0];
        }
        return (
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={title}
                />
            </div>
        );
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
        const vimeoId = url.split('/').pop();
        return (
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
                <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?h=0&title=0&byline=0&portrait=0`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={title}
                />
            </div>
        );
    }

    // Direct video file
    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
            <video src={url} controls className="w-full h-full" title={title} />
        </div>
    );
}

export default function LessonPage({ params }) {
    const { id: courseId, lectureId } = React.use(params);
    const { user } = useAuth();
    const userIdentifier = user?.email || user?.name || 'Student';

    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    // PDF specific states
    const [numPages, setNumPages] = useState(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

    // Refs for security & fullscreen
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const iframeRef = useRef(null);
    const [isMaximized, setIsMaximized] = useState(false);

    // Fullscreen Toggle
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Fullscreen listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsMaximized(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Security listener (DOM Blackout & No Right Click)
    useEffect(() => {
        let hideTimeout;
        const handleKeyDown = (e) => {
            // Trigger on PrintScreen or Cmd+Shift+S / Cmd+Shift+4 etc.
            if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey)) {
                clearTimeout(hideTimeout);
                if (overlayRef.current) overlayRef.current.style.display = 'flex';
                if (iframeRef.current) iframeRef.current.style.opacity = '0';
            }
        };

        const handleKeyUp = (e) => {
            if (!e.metaKey && !e.shiftKey && e.key !== 'PrintScreen') {
                hideTimeout = setTimeout(() => {
                    if (overlayRef.current) overlayRef.current.style.display = 'none';
                    if (iframeRef.current) iframeRef.current.style.opacity = '1';
                }, 1000); // 1s cooldown
            }
        };

        const handleContextMenu = (e) => e.preventDefault();

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            clearTimeout(hideTimeout);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await coursesApi.getCourseWithContent(courseId);
                const data = response?.data || response;
                setCourseData(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch course:', err);
                setError('Failed to load lesson. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        if (courseId) fetchCourse();
    }, [courseId]);

    // Fetch the raw encoded PDF blob when courseData and lecture is identified
    useEffect(() => {
        if (!courseData) return;
        const tempLoc = findLessonInTree(courseData.curriculum || [], lectureId) || getFirstLesson(courseData.curriculum || []);
        if (tempLoc?.data?.type === 'document') {
                    const fetchDocument = async () => {
                        try {
                            const ticketResponse = await coursesApi.getSecureDocumentTicket(courseId, tempLoc.id);
                            const { ticket, timestamp } = ticketResponse.data;
                            
                            const blob = await coursesApi.getSecureDocumentStream(courseId, tempLoc.id, ticket, timestamp);
                            const url = URL.createObjectURL(blob);
                            setPdfBlobUrl(url);
                        } catch (err) {
                            console.error("Failed to fetch secure document", err);
                            // We could set an error state here specifically for 'Not Enrolled' etc.
                        }
                    };
                    fetchDocument();
        }
    }, [courseData, lectureId, courseId]);

    // Loading state
    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading lesson...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !courseData) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
                    <Link href="/courses">
                        <Button>Browse Courses</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const curriculum = courseData.curriculum || [];
    const currentLesson = findLessonInTree(curriculum, lectureId) || getFirstLesson(curriculum);

    if (!currentLesson) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Lesson not found</p>
                    <Link href={`/courses/${courseId}`}>
                        <Button variant="outline">Back to Course</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const lessonData = currentLesson.data || {};
    const contentType = lessonData.type || 'video';
    const contentUrl = lessonData.content || '';
    const description = lessonData.description || '';
    const duration = lessonData.duration ? formatDuration(lessonData.duration) : '';
    const instructor = courseData.instructor || {};

    return (
        <div className="bg-white min-h-screen font-sans text-gray-900 select-none print:hidden">
            <style jsx global>{`
                @media print {
                    body { display: none !important; }
                }
            `}</style>

            {/* Main Grid Layout */}
            <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] overflow-hidden">

                {/* LEFT COLUMN: Main Content */}
                <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">

                    {/* Top Action Bar */}
                    <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md shrink-0 z-10">
                        <div className="flex items-center gap-4">
                            <Link href={`/courses/${courseId}`} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
                                <ChevronLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-sm text-gray-400 font-medium">{courseData.title}</h1>
                                <h2 className="text-base font-semibold truncate max-w-md">{currentLesson.title}</h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button size="sm" className="hidden sm:flex bg-primary-600 hover:bg-primary-700 text-white border-0">
                                Mark as Complete
                            </Button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="w-full bg-black relative">
                        {contentType === 'video' && contentUrl ? (
                            <div className="max-w-[1200px] mx-auto w-full">
                                <VideoContent url={contentUrl} title={currentLesson.title} />
                            </div>
                        ) : contentType === 'document' && contentUrl ? (
                            <div ref={containerRef} className="bg-white w-full h-full relative overflow-hidden flex flex-col min-h-[500px]">
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
                                <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.05] overflow-hidden flex flex-wrap content-start select-none">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="w-[300px] h-[300px] flex items-center justify-center -rotate-45 transform">
                                            <span className="text-3xl font-bold text-black">{userIdentifier}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* 2. Security Overlay (Ref-controlled) */}
                                <div
                                    ref={overlayRef}
                                    style={{ display: 'none' }} // Hidden by default, toggled via Ref
                                    className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md items-center justify-center select-none flex flex-col"
                                >
                                    <div className="text-4xl mb-2">🔒</div>
                                    <h3 className="text-xl font-bold text-gray-800">Security Mode Active</h3>
                                    <p className="text-gray-500 mt-1">Taking screenshots is explicitly prohibited</p>
                                </div>

                                {/* 3. Actual Content using React-PDF Canvas */}
                                {contentUrl.endsWith('.pdf') || contentUrl.includes('response-content-disposition') || contentUrl.includes('documents%2F') ? (
                                    pdfBlobUrl ? (
                                        <div className="flex-1 w-full h-full overflow-y-auto bg-gray-100 flex flex-col items-center py-4">
                                            <Document
                                                file={pdfBlobUrl}
                                                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                                className="flex flex-col items-center gap-4"
                                                loading={<div className="animate-pulse text-gray-500">Decrypting & Loading Document...</div>}
                                            >
                                                {Array.from(new Array(numPages || 0), (el, index) => (
                                                    <Page 
                                                        key={`page_${index + 1}`} 
                                                        pageNumber={index + 1} 
                                                        width={Math.min(window.innerWidth * 0.8, 800)}
                                                        className="shadow-xl"
                                                    />
                                                ))}
                                            </Document>
                                        </div>
                                    ) : (
                                        <div className="flex-1 w-full h-full flex items-center justify-center bg-gray-50 text-gray-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3"></div>
                                            Loading Secure Document...
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center py-10 my-auto flex-1 flex flex-col justify-center items-center">
                                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                                        <p className="text-gray-600 mb-4">Document available</p>
                                        <a href={contentUrl} target="_blank" rel="noopener noreferrer">
                                            <Button>
                                                <Download size={16} className="mr-2" /> Download Document
                                            </Button>
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-gray-900 w-full aspect-video flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No content uploaded for this lesson yet.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Info */}
                    <div className="max-w-[1000px] mx-auto px-4 lg:px-8 py-8 space-y-8 pb-20">

                        {/* Lesson Title & Actions */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{currentLesson.title}</h2>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    {duration && <span>Duration: {duration}</span>}
                                    {contentType && <span className="capitalize">Type: {contentType}</span>}
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
                        {instructor.name && (
                            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                    {instructor.avatar ? (
                                        <img src={instructor.avatar} className="w-12 h-12 rounded-full object-cover" alt="Instructor" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                                            {instructor.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-gray-900">{instructor.name}</h4>
                                        {instructor.role && <span className="text-sm text-gray-500">{instructor.role}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tabs */}
                        <div>
                            <div className="flex items-center border-b border-gray-200 mb-6">
                                {['Overview', 'Notes'].map(tab => (
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

                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-fade-in">
                                    {description ? (
                                        <div>
                                            <h3 className="text-xl font-bold mb-3">Lesson Description</h3>
                                            <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                                                {description}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-gray-400">
                                            <p>No description available for this lesson.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Notes Tab */}
                            {activeTab === 'notes' && (
                                <div className="text-center py-10 text-gray-500 animate-fade-in">
                                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>You haven&apos;t taken any notes for this lesson yet.</p>
                                    <Button variant="outline" className="mt-4">Create New Note</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Sidebar */}
                <div className="w-full lg:w-[400px] shrink-0 h-full border-l border-gray-200 bg-white overflow-hidden">
                    <CurriculumSidebar
                        curriculum={curriculum}
                        currentLectureId={lectureId}
                        courseId={courseId}
                    />
                </div>

            </div>
        </div>
    );
}
