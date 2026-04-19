'use client';

import React, { useState, useEffect, use } from 'react';
import {
    Star, Play, FileText, Download, Award, Clock,
    CheckCircle, Globe, Share2, Heart, Monitor,
    Smartphone, Infinity, ChevronDown, ChevronRight,
    FolderOpen, PlayCircle, File, BarChart, Captions, AlertCircle, Lock,
    Video, BookOpen, ClipboardList
} from 'lucide-react';
import Link from 'next/link';
import { Button, Badge, Accordion, AccordionItem, AccordionTrigger, AccordionContent, CourseCard } from '@/components/ui';
import { coursesApi } from '@/services/courses.api';

// Helper: format seconds → "Xh Ym" or "Xm"
function formatDuration(seconds) {
    if (!seconds) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

// Helper: format seconds → "MM:SS"
function formatLectureDuration(seconds) {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Helper: flatten curriculum tree to count lectures & total duration
function getCurriculumStats(content) {
    let lectures = 0;
    let totalDuration = 0;

    const walk = (nodes) => {
        if (!nodes) return;
        for (const node of nodes) {
            if (node.type === 'file') {
                lectures++;
                totalDuration += node.data?.duration || 0;
            }
            if (node.children) walk(node.children);
        }
    };
    walk(content);
    return { lectures, totalDuration };
}

// Helper: get icon for lesson content type
function ContentTypeIcon({ type, className }) {
    switch (type) {
        case 'video': return <PlayCircle className={className} />;
        case 'document': return <FileText className={className} />;
        case 'quiz': return <ClipboardList className={className} />;
        case 'assignment': return <BookOpen className={className} />;
        default: return <PlayCircle className={className} />;
    }
}

export default function CourseDetailPage({ params }) {
    const { id } = use(params);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await coursesApi.getCourseWithContent(id);
                const course = response?.data || response;
                setData(course);
                setError(null);
            } catch (err) {
                setError('Failed to load course. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchCourse();
    }, [id]);

    // Loading
    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading course...</p>
                </div>
            </div>
        );
    }

    // Error
    if (error || !data) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
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

    // Map backend fields
    const title = data.title || 'Untitled Course';
    const subtitle = data.subtitle || data.descriptions || '';
    const category = data.category || '';
    const subCategory = data.sub_category || '';
    const description = data.descriptions || '';
    const price = data.price || 0;
    const originalPrice = data.original_price || 0;
    const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const rating = data.average_rating || 0;
    const ratingCount = data.rating_count || 0;
    const students = data.enrollment_count || 0;
    const level = data.level || 'Beginner';
    const language = 'English';
    const thumbnail = data.thumbnail || '';
    const trailer = data.trailer || '';
    const whatToLearn = data.what_to_learn || [];
    const requirements = data.requirements || [];
    const targetAudience = data.target_audience || [];
    const instructor = data.instructor || {};
    const curriculum = data.curriculum || [];

    // Compute curriculum stats
    const stats = getCurriculumStats(curriculum);
    const sectionCount = curriculum.filter(n => n.type === 'folder' || n.type === 'section').length || curriculum.length;

    return (
        <div className="bg-gray-50 min-h-screen pb-20 font-sans">
            <div className="container mx-auto px-4 py-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-primary-600">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/courses" className="hover:text-primary-600">Courses</Link>
                    {category && (
                        <>
                            <ChevronRight size={14} />
                            <span className="hover:text-primary-600 cursor-pointer">{category}</span>
                        </>
                    )}
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">

                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Header */}
                        <div className="space-y-4">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{title}</h1>
                            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}

                            <div className="flex flex-wrap items-center gap-6 text-sm pt-2">
                                <div className="flex items-center gap-3">
                                    {instructor && (instructor.avatar || instructor.image) ? (
                                        <img src={instructor.avatar || instructor.image} alt={instructor?.name || 'Instructor'} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                            {(instructor?.name || 'I').charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-gray-500 text-xs">Created by:</div>
                                        <div className="font-medium text-gray-900">{instructor?.name || 'Unknown Instructor'}</div>
                                    </div>
                                </div>
                                {rating > 0 && (
                                    <div className="flex items-center gap-1">
                                        <div className="flex text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className={i < Math.floor(rating) ? "fill-current" : "text-gray-300"} />
                                            ))}
                                        </div>
                                        <span className="font-bold text-gray-900">{rating}</span>
                                        {ratingCount > 0 && <span className="text-gray-500">({ratingCount.toLocaleString()} Ratings)</span>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail / Trailer */}
                        {((trailer && trailer.trim()) || (thumbnail && thumbnail.trim())) && (
                            <div className="relative rounded-2xl overflow-hidden shadow-sm bg-gray-100 border border-gray-200 h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
                                {trailer && trailer.trim() ? (
                                    trailer.includes('youtube.com') || trailer.includes('youtu.be') ? (
                                        <iframe
                                            className="w-full h-full"
                                            src={`https://www.youtube.com/embed/${trailer.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1] || ''}`}
                                            title="Course Trailer"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <video src={trailer} controls className="w-full h-full object-cover bg-black" />
                                    )
                                ) : (
                                    <img
                                        src={thumbnail}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/800x450/e5e7eb/9ca3af?text=Image+Unavailable';
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="sticky top-20 z-10 bg-gray-50 pt-2 pb-4">
                            <div className="flex items-center gap-8 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                                {['Overview', 'Curriculum', 'Instructor', 'Reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setActiveTab(tab.toLowerCase());
                                            document.getElementById(tab.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className={`pb-3 text-base font-medium whitespace-nowrap transition-all ${activeTab === tab.toLowerCase()
                                            ? 'text-primary-600 border-b-2 border-primary-600'
                                            : 'text-gray-500 hover:text-gray-800'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Overview */}
                        <section className="space-y-8 scroll-mt-32" id="overview">
                            {description && (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
                                    <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                                        {description}
                                    </div>
                                </div>
                            )}

                            {whatToLearn.length > 0 && (
                                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">What you will learn in this course</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        {whatToLearn.map((item, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} />
                                                <p className="text-sm text-gray-700 leading-snug">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {requirements.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Requirements</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
                                        {requirements.map((req, i) => <li key={i}>{req}</li>)}
                                    </ul>
                                </div>
                            )}

                            {targetAudience.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Who this course is for:</h3>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
                                        {targetAudience.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                            )}
                        </section>

                        {/* Curriculum */}
                        <section className="scroll-mt-32" id="curriculum">
                            <div className="flex flex-wrap items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Curriculum</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><FolderOpen size={16} /> {sectionCount} Sections</span>
                                    <span className="flex items-center gap-1"><PlayCircle size={16} /> {stats.lectures} Lectures</span>
                                    {stats.totalDuration > 0 && (
                                        <span className="flex items-center gap-1"><Clock size={16} /> {formatDuration(stats.totalDuration)}</span>
                                    )}
                                </div>
                            </div>

                            {curriculum.length > 0 ? (
                                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                    <Accordion type="single" collapsible className="w-full">
                                        {curriculum.map((section) => (
                                            <AccordionItem key={section.id} value={section.id}>
                                                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                                                    <div className="flex flex-1 items-center justify-between mr-4 text-left">
                                                        <span className="font-semibold text-gray-900 text-lg">{section.title}</span>
                                                        <span className="text-sm text-gray-500 font-normal hidden sm:block">
                                                            {section.children?.filter(c => c.type === 'file').length || 0} lectures
                                                        </span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="p-0 border-t border-gray-100">
                                                    <div className="divide-y divide-gray-50">
                                                        {(section.children || []).map((item) => {
                                                            if (item.type === 'folder') {
                                                                // Nested folder — render as sub-group
                                                                return (
                                                                    <div key={item.id}>
                                                                        <div className="px-6 py-2 bg-gray-50 text-sm font-medium text-gray-600 flex items-center gap-2">
                                                                            <FolderOpen size={14} />
                                                                            {item.title}
                                                                        </div>
                                                                        {(item.children || []).map((subItem) => (
                                                                            <LessonRow key={subItem.id} item={subItem} courseId={id} />
                                                                        ))}
                                                                    </div>
                                                                );
                                                            }
                                                            return <LessonRow key={item.id} item={item} courseId={id} />;
                                                        })}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                                    <p className="text-gray-500">No curriculum available yet.</p>
                                </div>
                            )}
                        </section>

                        {/* Instructor */}
                        <section className="scroll-mt-32" id="instructor">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Instructor</h3>
                            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="shrink-0">
                                        {instructor && (instructor.avatar || instructor.image) ? (
                                            <img src={instructor.avatar || instructor.image} alt={instructor?.name || 'Instructor'} className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold border-4 border-gray-50 shadow-sm">
                                                {(instructor?.name || 'I').charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">{instructor?.name || 'Unknown Instructor'}</h4>
                                            {instructor?.role && <p className="text-gray-500 text-sm">{instructor.role}</p>}
                                        </div>
                                        {instructor?.bio && (
                                            <p className="text-gray-600 leading-relaxed text-sm">{instructor.bio}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Reviews */}
                        <section className="scroll-mt-32" id="reviews">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Student Feedback</h3>
                            {rating > 0 ? (
                                <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                                    <div className="text-5xl font-extrabold text-gray-900 mb-2">{rating}</div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"} size={20} />
                                        ))}
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">Course Rating</div>
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                                    <p className="text-gray-500">No reviews yet. Be the first to review this course!</p>
                                </div>
                            )}
                        </section>

                    </div>

                    {/* SIDEBAR */}
                    <div className="relative">
                        <div className="sticky top-24 bg-white border border-gray-100 rounded-xl p-6 shadow-soft animate-fade-in-up">

                            {/* Price */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-gray-900">₹{price}</span>
                                    {originalPrice > price && (
                                        <span className="text-lg text-gray-400 line-through">₹{originalPrice}</span>
                                    )}
                                </div>
                                {discount > 0 && (
                                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-sm font-bold">{discount}% off</span>
                                )}
                            </div>

                            <hr className="border-gray-100 mb-6 mt-4" />

                            {/* Meta */}
                            <div className="space-y-4 mb-8">
                                {stats.totalDuration > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                                            <Clock size={18} className="text-primary-600" />
                                            <span>Duration</span>
                                        </div>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{formatDuration(stats.totalDuration)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                                        <BarChart size={18} className="text-primary-600" />
                                        <span>Level</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold capitalize">{level}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                                        <Monitor size={18} className="text-primary-600" />
                                        <span>Students</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{students.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                                        <PlayCircle size={18} className="text-primary-600" />
                                        <span>Lectures</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{stats.lectures}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                                        <Globe size={18} className="text-primary-600" />
                                        <span>Language</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{language}</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex gap-3 mb-6">
                                <Button className="flex-1 h-12 text-base font-bold bg-white text-primary-600 border-2 border-primary-100 hover:border-primary-600 hover:bg-primary-50 transition-colors">
                                    Add To Cart
                                </Button>
                                <Button className="flex-1 h-12 text-base font-bold bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]">
                                    Buy Now
                                </Button>
                            </div>

                            <hr className="border-gray-100 mb-6" />

                            {/* Includes */}
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4 text-sm">This course includes:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Monitor className="text-primary-500" size={18} />
                                        <span>Lifetime access</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Award className="text-primary-500" size={18} />
                                        <span>Certificate of completion</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Smartphone className="text-primary-500" size={18} />
                                        <span>Access on mobile & tablet</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Globe className="text-primary-500" size={18} />
                                        <span>100% online course</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Lesson row component for curriculum
function LessonRow({ item, courseId }) {
    const isLocked = item.data?.isLocked !== false; // default locked
    const isFree = !isLocked;
    const contentType = item.data?.type || 'video';
    const duration = item.data?.duration ? formatLectureDuration(item.data.duration) : '';

    const content = (
        <div className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
                <ContentTypeIcon type={contentType} className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                <span className="text-gray-700 text-sm font-medium group-hover:text-primary-700 transition-colors">{item.title}</span>
            </div>
            <div className="flex items-center gap-4">
                {isFree && <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full font-medium">Preview</span>}
                {isLocked && <Lock size={14} className="text-gray-400" />}
                {duration && <span className="text-xs text-gray-500">{duration}</span>}
            </div>
        </div>
    );

    return (
        <Link href={`/courses/${courseId}/learn/lecture/${item.id}`}>
            {content}
        </Link>
    );
}
