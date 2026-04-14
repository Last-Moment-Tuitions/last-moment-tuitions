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
import { useCart } from '@/context/CartContext';
import { coursesApi } from '@/services/courses.api';

// --- MOCK DATA ---
const COURSE_DATA = {
    id: '69b51517987db35d311d828c',
    title: "Complete Website Responsive Design: from Figma to Webflow to Website Design",
    subtitle: "3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing.",
    category: "Development",
    subcategory: "Web Development",
    topic: "Webflow",
    rating: 4.8,
    ratingCount: 451444,
    students: 236568,
    lastUpdated: "11/2024",
    language: "English",
    image: "https://images.unsplash.com/photo-1581291518137-97d425c04cc1?q=80&w=600&auto=format&fit=crop",
    price: 4999,
    originalPrice: 12999,
    discount: "62% off",
    instructor: {
        name: "Vako Shvili",
        role: "Entrepreneur & Designer • Founder of ShiftRide",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        bio: "I'm an entrepreneur & designer with a high passion for building products of all sorts and seeing ideas come to life. As a serial entrepreneur, I've designed and built projects in fields ranging from fashion to technology. I have over 10 years of experience in both...",
        courses: 9,
        students: 236568,
        reviews: 45144,
        rating: 4.8
    },
    level: "Beginner and Intermediate",
    subtitles: "English",
    description: `It gives you a huge self-satisfaction when you look at your work and say, "I made this!". I love that feeling after I'm done working on something. When I lean back in my chair, look at the final result with a smile, and have this little "spark joy" moment. It's especially satisfying when I know I just made $5,000. I do! And that's why I got into this field. Not for the love of Web Design, which I do now. But for the LIFESTYLE! 
    
    There are many ways one can achieve this lifestyle. This is my way. This is how I achieved a lifestyle I've been fantasizing about for five years. And I'm going to teach you the same. Often people think Web Design is complicated. That it needs some creative talent or knack for computers. Sure, a lot of people make it very complicated. People make the simplest things complicated. Like most subjects taught in the universities. But I don't like complicated. I like easy. I like life hacks. I like to take the shortest and simplest route to my destination.`,
    whatYouWillLearn: [
        "You will learn how to design beautiful websites using Figma, an interface design tool used by designers at Uber, Airbnb and Microsoft.",
        "You will learn how to take your designs and build them into powerful websites using Webflow, a state-of-the-art site builder used by top companies.",
        "You will learn the secret tips of Freelance Web Designers and how they make great money working from home.",
        "You will communicate with your clients and write winning proposals.",
        "You will build a stunning portfolio website to showcase your work.",
        "You will learn design principles that you can apply to any project."
    ],
    requirements: [
        "Nunc auctor consequat lorem, in posuere enim hendrerit sed.",
        "Sed sagittis suscipit condimentum pellentesque vulputate feugiat libero nec accumsan.",
        "Duis ornare enim ullamcorper congue consectetur suspendisse interdum tristique est sed molestie.",
        "Those who are looking to reboot their work life and try a new profession that is fun, rewarding and highly in-demand.",
        "Praesent eget consequat elit. Duis a pretium purus.",
        "Sed nec dapibus orci integer nisl turpis, eleifend sit amet aliquam vel, lacinia quis ex."
    ],
    whoIsFor: [
        "Create a portfolio website for your business or personal brand.",
        "Beginner Web Designers who want to learn the basics of Figma and Webflow.",
        "Designers who want to learn how to move from Figma to Webflow.",
        "Anyone who wants to learn how to make money freelancing.",
        "Entrepreneurs who want to skip hiring a developer and build their own website."
    ],
    curriculum: {
        sections: 6,
        lectures: 202,
        duration: "19h 37m",
        content: [
            {
                id: 's1',
                title: "Introduction to Web Design",
                lectures: 3,
                duration: "07:31",
                items: [
                    { id: 'l1', title: "What is Webflow?", type: "video", duration: "02:30", free: true },
                    { id: 'l2', title: "Sign up with Webflow", type: "file", size: "5 MB", free: false },
                    { id: 'l3', title: "Web Design Principles", type: "video", duration: "05:01", free: true }
                ]
            },
            {
                id: 's2',
                title: "Figma Essentials",
                lectures: 5,
                duration: "45:10",
                items: [
                    { id: 'l4', title: "Interface Tour", type: "video", duration: "10:00", free: false },
                    { id: 'l5', title: "Frames & Shapes", type: "video", duration: "15:20", free: false },
                    { id: 'l6', title: "Pen Tool Masterclass", type: "video", duration: "20:00", free: false }
                ]
            },
            {
                id: 's3',
                title: "Building the Portfolio",
                lectures: 8,
                duration: "55:00",
                items: [
                    { id: 'l7', title: "Hero Section", type: "video", duration: "15:00", free: false },
                    { id: 'l8', title: "Grid Systems", type: "video", duration: "20:00", free: false },
                    { id: 'l9', title: "Asset Preparation", type: "file", size: "12 MB", free: false }
                ]
            }
        ]
    }
};

const RELATED_COURSES = [
    {
        id: '67c5705335d189ced54df5f6',
        title: "UPSC Civil Services Prelims 2024 - Complete Guide",
        category: "Government",
        price: 2499,
        originalPrice: 4999,
        rating: 4.9,
        students: "24,000",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop",
        instructor: "Dr. Anjali Verma"
    },
    {
        id: '67c74233f20d20d4f40f3676',
        title: "Engineering Mathematics I & II for Sem 1",
        category: "Engineering",
        price: 999,
        originalPrice: 1599,
        rating: 4.7,
        students: "9,728",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
        instructor: "Prof. Das"
    },
    {
        id: '67c74233f20d20d4f40f3677',
        title: "IBPS PO & Clerk Complete Preparation Batch",
        category: "Preparation Exams",
        price: 1499,
        originalPrice: 2999,
        rating: 4.6,
        students: "12,444",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
        instructor: "Banking Adda"
    },
    {
        id: '67c74233f20d20d4f40f3678',
        title: "Python for Data Science and Machine Learning",
        category: "Programming",
        price: 699,
        originalPrice: 1299,
        rating: 4.5,
        students: "8,637",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
        instructor: "Arun Kumar"
    }
];

const DEFAULT_COURSE_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop';

function formatDiscount(price, originalPrice) {
    if (!originalPrice || originalPrice <= price) return '';
    const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
    return `${discountPercent}% off`;
}

function mapCourseData(course) {
    const price = Number(course?.price || 0);
    const originalPrice = Number(course?.original_price || 0);

    return {
        id: course?._id || '',
        title: course?.title || 'Untitled Course',
        subtitle: course?.subtitle || '',
        category: course?.category || 'Course',
        subcategory: course?.sub_category || '',
        topic: course?.topic || '',
        rating: Number(course?.average_rating || 0),
        ratingCount: Number(course?.rating_count || 0),
        students: Number(course?.enrollment_count || 0),
        lastUpdated: course?.last_updated || '',
        language: course?.language || 'English',
        image: course?.thumbnail || DEFAULT_COURSE_IMAGE,
        price,
        originalPrice,
        discount: formatDiscount(price, originalPrice),
        instructor: {
            name: course?.instructor?.name || 'Unknown Instructor',
            role: course?.instructor?.role || '',
            image: course?.instructor?.image || DEFAULT_COURSE_IMAGE,
            bio: course?.instructor?.bio || '',
            courses: 0,
            students: Number(course?.enrollment_count || 0),
            reviews: Number(course?.review_count || 0),
            rating: Number(course?.average_rating || 0),
        },
        level: course?.level || 'All Levels',
        subtitles: course?.subtitle_language || '',
        description: course?.descriptions || '',
        whatYouWillLearn: course?.what_to_learn || [],
        requirements: course?.requirements || [],
        whoIsFor: course?.target_audience || [],
        curriculum: {
            sections: 0,
            lectures: 0,
            duration: course?.duration || '',
            content: [],
        },
    };
}

export default function CourseDetailPage({ params }) {
    const { id } = use(params);
    const [activeTab, setActiveTab] = useState('overview');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await coursesApi.getCourse(id);
                const course = response?.data;

                if (!course) {
                    setError('Course not found.');
                    setData(null);
                    return;
                }

                setData(mapCourseData(course));
                setError('');
            } catch (err) {
                console.error('Failed to load course details:', err);
                setError('Failed to load course details.');
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourse();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen py-8 font-sans">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading course...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-gray-50 min-h-screen py-8 font-sans">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error || 'Course not found.'}</p>
                            <Button href="/courses" variant="primary">
                                Back to Courses
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20 font-sans">
            <div className="container mx-auto px-4 py-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-primary-600">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/courses" className="hover:text-primary-600">Courses</Link>
                    <ChevronRight size={14} />
                    <span className="hover:text-primary-600 cursor-pointer">{data.category}</span>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{data.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">

                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Title Section */}
                        <div className="space-y-4">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{data.title}</h1>
                            <p className="text-lg text-gray-600 font-medium">{data.subtitle}</p>

                            <div className="flex flex-wrap items-center gap-6 text-sm pt-2">
                                <div className="flex items-center gap-3">
                                    <img src={data.instructor.image} alt={data.instructor.name} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <div className="text-gray-500 text-xs">Created by:</div>
                                        <div className="font-medium text-gray-900">{data.instructor.name}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="flex text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className={i < 4 ? "fill-current" : "text-gray-300"} />
                                        ))}
                                    </div>
                                    <span className="font-bold text-gray-900">{data.rating}</span>
                                    <span className="text-gray-500">({data.ratingCount.toLocaleString()} Ratings)</span>
                                </div>
                                <div className="text-gray-500">
                                    <span className="font-medium text-gray-900">{data.students.toLocaleString()}</span> students
                                </div>
                            </div>
                        </div>

                        {/* Video / Thumbnail Area */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black group h-64 md:h-80 lg:h-96 w-full">
                            <img
                                src={data.image}
                                alt={data.title}
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all cursor-pointer">
                                    <Play className="text-primary-600 fill-primary-600 ml-1" size={24} />
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-6 text-white text-sm font-bold bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                Preview this course
                            </div>
                        </div>

                        {/* Tabs Navigation */}
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

                        {/* Content Sections */}
                        <section className="space-y-12 scroll-mt-32" id="overview">
                            {/* What you'll learn */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">What you will learn in this course</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    {data.whatYouWillLearn.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} />
                                            <p className="text-sm text-gray-700 leading-snug">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900 border-l-4 border-primary-600 pl-4">Description</h3>
                                <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line leading-relaxed text-[15px]">
                                    {data.description}
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900">Requirements</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.requirements.map((req, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-600 shrink-0" />
                                            <span className="text-sm">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Target Audience */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900">Who this course is for:</h3>
                                <div className="space-y-3">
                                    {data.whoIsFor.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-gray-600">
                                            <ChevronRight className="text-primary-600 shrink-0 mt-1" size={16} />
                                            <p className="text-sm">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Curriculum Section */}
                        <section className="scroll-mt-32" id="curriculum">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Curriculum</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                    <span>{data.curriculum.sections} Sections</span>
                                    <span>•</span>
                                    <span>{data.curriculum.lectures} Lectures</span>
                                    <span>•</span>
                                    <span>{data.curriculum.duration} Total length</span>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                <Accordion type="single" collapsible className="w-full">
                                    {data.curriculum.content.map((section, idx) => (
                                        <AccordionItem key={idx} value={`section-${idx}`} className="border-b border-gray-200 last:border-0">
                                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 data-[state=open]:bg-gray-50 transition-colors">
                                                <div className="flex flex-1 items-center justify-between mr-4 text-left">
                                                    <span className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{section.title}</span>
                                                    <span className="text-sm text-gray-500 font-medium hidden sm:block">
                                                        {section.lectures} lectures • {section.duration}
                                                    </span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="p-0 bg-white">
                                                <div className="divide-y divide-gray-100">
                                                    {section.items.map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group">
                                                            <div className="flex items-center gap-4">
                                                                {item.type === 'video' ? (
                                                                    <PlayCircle className="text-gray-400 group-hover:text-primary-600" size={18} />
                                                                ) : (
                                                                    <FileText className="text-gray-400 group-hover:text-primary-600" size={18} />
                                                                )}
                                                                <span className="text-gray-700 font-medium text-sm group-hover:text-gray-900">{item.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                {item.free && (
                                                                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Preview</span>
                                                                )}
                                                                {!item.free && <Lock size={14} className="text-gray-400" />}
                                                                <span className="text-xs text-gray-500 font-medium">{item.duration || item.size}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </section>

                        {/* Instructor Section */}
                        <section className="scroll-mt-32" id="instructor">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Instructor</h3>
                            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="shrink-0">
                                        <img src={data.instructor.image} alt={data.instructor.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-md" />
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                                <Star size={16} className="text-amber-400 fill-amber-400" />
                                                <span>{data.instructor.rating} Instructor Rating</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                                <Award size={16} className="text-primary-500" />
                                                <span>{data.instructor.reviews.toLocaleString()} Reviews</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                                <Monitor size={16} className="text-primary-500" />
                                                <span>{data.instructor.students.toLocaleString()} Students</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                                <PlayCircle size={16} className="text-primary-500" />
                                                <span>{data.instructor.courses} Courses</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="pb-4 border-b border-gray-100">
                                            <h4 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer">{data.instructor.name}</h4>
                                            <p className="text-gray-500 text-sm font-medium">{data.instructor.role}</p>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed text-[15px]">
                                            {data.instructor.bio}
                                        </p>
                                        <Button variant="outline" className="text-primary-600 border-primary-200 hover:bg-primary-50 font-bold">Show More</Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Reviews/Feedback Section */}
                        <section className="scroll-mt-32" id="reviews">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">Student Feedback</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="md:col-span-1 flex flex-col items-center justify-center p-8 bg-primary-50 rounded-2xl border border-primary-100 shadow-sm">
                                    <h4 className="text-5xl font-black text-primary-600 mb-2">{data.rating}</h4>
                                    <div className="flex text-amber-500 mb-2">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-current" />)}
                                    </div>
                                    <span className="text-primary-800 font-bold text-sm">Course Rating</span>
                                </div>
                                <div className="md:col-span-3 space-y-3">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div key={star} className="flex items-center gap-4 group cursor-pointer">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className="bg-primary-600 h-full rounded-full transition-all duration-1000 group-hover:bg-primary-700"
                                                    style={{ width: `${star === 5 ? 75 : star === 4 ? 18 : 2}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 min-w-[120px]">
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} className={i < star ? "fill-current" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                                <span className="text-xs font-bold text-gray-900">{star === 5 ? 75 : star === 4 ? 18 : 2}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Related Courses */}
                        <section className="pt-12 border-t border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Courses</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {RELATED_COURSES.slice(0, 3).map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        id={course.id}
                                        title={course.title}
                                        category={course.category}
                                        price={course.price}
                                        oldPrice={course.originalPrice}
                                        rating={course.rating}
                                        students={course.students}
                                        image={course.image}
                                        instructor={course.instructor}
                                    />
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* SIDEBAR Section */}
                    <div className="relative">
                        <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-6 shadow-soft animate-fade-in-up">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-gray-900">₹{data.price}</span>
                                    <span className="text-lg text-gray-400 line-through">₹{data.originalPrice}</span>
                                </div>
                                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-bold">{data.discount}</span>
                            </div>

                            <hr className="border-gray-100 mb-6" />

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3 text-gray-600 font-medium">
                                        <Clock size={18} className="text-primary-600" />
                                        <span>Duration</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[11px] font-bold">{data.curriculum.duration}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3 text-gray-600 font-medium">
                                        <BarChart size={18} className="text-primary-600" />
                                        <span>Level</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[11px] font-bold">All Levels</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3 text-gray-600 font-medium">
                                        <Captions size={18} className="text-primary-600" />
                                        <span>Language</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[11px] font-bold">{data.language}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3 text-gray-600 font-medium">
                                        <Award size={18} className="text-primary-600" />
                                        <span>Certificate</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[11px] font-bold">Yes</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mb-8">
                                <Button
                                    onClick={() => addToCart(data)}
                                    className="w-full h-12 text-base font-bold bg-[#153A8D] text-white hover:bg-[#153A8D]/90 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                                >
                                    Add To Cart
                                </Button>
                                <Button className="w-full h-12 text-base font-bold bg-white text-[#153A8D] border-2 border-[#153A8D] hover:bg-blue-50 transition-colors">
                                    Buy Now
                                </Button>
                            </div>

                            <div className="text-center mb-8">
                                <p className="text-xs text-gray-400 font-medium">30-Day Money-Back Guarantee</p>
                            </div>

                            <hr className="border-gray-100 mb-6" />

                            <div>
                                <h4 className="font-bold text-gray-900 mb-4 text-sm">This course includes:</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Monitor className="text-primary-500" size={18} />
                                        <span className="font-medium">Lifetime access</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Award className="text-primary-500" size={18} />
                                        <span className="font-medium">Certificate of completion</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Smartphone className="text-primary-500" size={18} />
                                        <span className="font-medium">Access on mobile & tablet</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Infinity className="text-primary-500" size={18} />
                                        <span className="font-medium">Full lifetime access</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-6">
                                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary-600 transition-colors">
                                    <Share2 size={16} /> Share
                                </button>
                                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary-600 transition-colors">
                                    <Heart size={16} /> Wishlist
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

