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
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

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
        <div className="bg-white min-h-screen font-sans text-gray-900">

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
                            <div className="bg-white w-full min-h-[500px] p-8">
                                {contentUrl.endsWith('.pdf') ? (
                                    <iframe src={contentUrl} className="w-full h-[600px] border-none" title="Document" />
                                ) : (
                                    <div className="text-center py-10">
                                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">Document available</p>
                                        <a href={contentUrl} target="_blank" rel="noopener noreferrer">
                                            <Button>
                                                <Download size={16} className="mr-2" /> Open Document
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
