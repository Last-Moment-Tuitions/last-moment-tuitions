'use client';

import React, { useState } from 'react';
import {
    Star, Play, FileText, Download, Award, Clock,
    CheckCircle, Globe, Share2, Heart, Monitor,
    Smartphone, Infinity, ChevronDown, ChevronRight,
    Facebook, Twitter, Youtube, Instagram,
    FolderOpen, PlayCircle, File, BarChart, Captions, AlertCircle, Copy, Mail
} from 'lucide-react';
import Link from 'next/link';
import { Button, Badge, Accordion, AccordionItem, AccordionTrigger, AccordionContent, CourseCard } from '@/components/ui';

// --- MOCK DATA ---
const COURSE_DATA = {
    id: '1',
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
    },
    reviews: [
        {
            id: 1,
            user: "Guy Hawkins",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guy",
            rating: 5,
            date: "1 week ago",
            comment: "I appreciate the precise short videos (10 mins or less each) because overly long videos tend to make me lose focus. The instructor is very knowledgeable in Web Design and it shows as he shares his knowledge. These were my best 6 months of training. Thanks, Vako."
        },
        {
            id: 2,
            user: "Jane Doe",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
            rating: 4,
            date: "2 weeks ago",
            comment: "Great course for beginners. The Figma section was a bit fast-paced but I managed to catch up. Webflow part is gold!"
        }
    ]

};

const RELATED_COURSES = [
    {
        id: '2',
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
        id: '3',
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
        id: '4',
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
        id: '5',
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

export default function CourseDetailPage({ params }) {
    const data = COURSE_DATA;
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="bg-gray-50 min-h-screen pb-20 font-sans">

            <div className="container mx-auto px-4 py-8">
                {/* --- Breadcrumb --- */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <span className="hover:text-primary-600 cursor-pointer">Home</span>
                    <ChevronRight size={14} />
                    <span className="hover:text-primary-600 cursor-pointer">{data.category}</span>
                    <ChevronRight size={14} />
                    <span className="hover:text-primary-600 cursor-pointer">{data.subcategory}</span>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium">{data.topic}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">

                    {/* --- MAIN CONTENT COLUMN --- */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Header Info */}
                        <div className="space-y-4">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                {data.title}
                            </h1>
                            <p className="text-lg text-gray-600">
                                {data.subtitle}
                            </p>

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
                                            <Star key={i} size={16} className={i < Math.floor(data.rating) ? "fill-current" : "text-gray-300"} />
                                        ))}
                                    </div>
                                    <span className="font-bold text-gray-900">{data.rating}</span>
                                    <span className="text-gray-500">({data.ratingCount.toLocaleString()} Ratings)</span>
                                </div>
                            </div>
                        </div>

                        {/* Video Area (Trailer) */}
                        <div className="relative rounded-2xl overflow-hidden shadow-lg bg-black h-64 md:h-80 lg:h-96 w-full">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/LXb3EKWsInQ?start=10"
                                title="Course Trailer"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
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

                        {/* Overview Section */}
                        <section className="space-y-8 scroll-mt-32" id="overview">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
                                <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                                    {data.description}
                                </div>
                            </div>

                            {/* What You Will Learn Box */}
                            <div className="bg-green-50/50 border border-green-100 rounded-2xl p-8">
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

                            {/* Requirements */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Requirements</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
                                    {data.requirements.map((req, i) => (
                                        <li key={i}>{req}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Who Content is For */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Who this course is for:</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
                                    {data.whoIsFor.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Curriculum Section */}
                        <section className="scroll-mt-32" id="curriculum">
                            <div className="flex flex-wrap items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Curriculum</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><FolderOpen size={16} /> {data.curriculum.sections} Sections</span>
                                    <span className="flex items-center gap-1"><PlayCircle size={16} /> {data.curriculum.lectures} Lectures</span>
                                    <span className="flex items-center gap-1"><Clock size={16} /> {data.curriculum.duration} Total Length</span>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                <Accordion type="single" collapsible className="w-full">
                                    {data.curriculum.content.map((section, idx) => (
                                        <AccordionItem key={section.id} value={section.id}>
                                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                                                <div className="flex flex-1 items-center justify-between mr-4 text-left">
                                                    <span className="font-semibold text-gray-900 text-lg">{section.title}</span>
                                                    <span className="text-sm text-gray-500 font-normal hidden sm:block">
                                                        {section.lectures} lectures • {section.duration}
                                                    </span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="p-0 border-t border-gray-100">
                                                <div className="divide-y divide-gray-50">
                                                    {section.items.map((item, itemIdx) => (
                                                        <Link
                                                            key={itemIdx}
                                                            href={`/courses/${data.id}/learn/lecture/${item.id}`}
                                                            className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {item.type === 'video' ? <PlayCircle size={16} className="text-gray-400 group-hover:text-primary-600 transition-colors" /> : <File size={16} className="text-gray-400 group-hover:text-primary-600 transition-colors" />}
                                                                <span className="text-gray-700 text-sm font-medium group-hover:text-primary-700 transition-colors">{item.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                {item.free && <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full font-medium">Preview</span>}
                                                                <span className="text-xs text-gray-500">{item.duration || item.size}</span>
                                                            </div>
                                                        </Link>
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
                            <div className="bg-white border border-gray-200 rounded-2xl p-8">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="shrink-0">
                                        <img src={data.instructor.image} alt={data.instructor.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">{data.instructor.name}</h4>
                                            <p className="text-gray-500 text-sm">{data.instructor.role}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-6 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Star className="text-amber-500 fill-amber-500" size={16} />
                                                <span className="font-semibold text-gray-900">{data.instructor.rating}</span> Rating
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="text-primary-500" size={16} />
                                                <span className="font-semibold text-gray-900">{data.instructor.reviews.toLocaleString()}</span> Reviews
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Monitor className="text-primary-500" size={16} />
                                                <span className="font-semibold text-gray-900">{data.instructor.students.toLocaleString()}</span> Students
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <PlayCircle className="text-primary-500" size={16} />
                                                <span className="font-semibold text-gray-900">{data.instructor.courses}</span> Courses
                                            </div>
                                        </div>

                                        <p className="text-gray-600 leading-relaxed text-sm">
                                            {data.instructor.bio}
                                            <button className="text-primary-600 font-medium ml-1 hover:underline">Read more</button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Reviews Section */}
                        <section className="scroll-mt-32" id="reviews">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Student Feedback</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                {/* Rating Summary */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                                    <div className="text-5xl font-extrabold text-gray-900 mb-2">{data.rating}</div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="fill-amber-400 text-amber-400" size={20} />
                                        ))}
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">Course Rating</div>
                                </div>

                                {/* Bars */}
                                <div className="md:col-span-2 space-y-3">
                                    {[5, 4, 3, 2, 1].map((stars, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="bg-white border border-gray-200 rounded-sm h-2 flex-1 overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400 rounded-sm"
                                                    style={{ width: idx === 0 ? '75%' : idx === 1 ? '15%' : '5%' }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center gap-1 w-20 justify-end">
                                                <div className="flex translate-y-[-1px]">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} className={i < stars ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium ml-2">{idx === 0 ? '75%' : idx === 1 ? '15%' : '5%'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Review List */}
                            <div className="space-y-6">
                                {data.reviews.map((review) => (
                                    <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                                        <div className="flex gap-4">
                                            <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h5 className="font-bold text-gray-900 text-sm">{review.user}</h5>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex text-amber-500">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-gray-500">• {review.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button variant="outline" className="w-full mt-6">View all Reviews</Button>
                        </section>

                    </div>


                    {/* --- SIDEBAR COLUMN --- */}
                    <div className="relative">
                        <div className="sticky top-24 bg-white border border-gray-100 rounded-sm p-6 shadow-soft animate-fade-in-up">

                            {/* Price */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-gray-900">₹{data.price}</span>
                                    <span className="text-lg text-gray-400 line-through">₹{data.originalPrice}</span>
                                </div>
                                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-sm font-bold">{data.discount}</span>
                            </div>

                            <div className="flex items-center gap-2 text-red-500 text-sm font-medium mb-6">
                                <Clock size={16} />
                                <span>2 days left at this price!</span>
                            </div>

                            <hr className="border-gray-100 mb-6" />

                            {/* Meta List */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                                        <Clock size={18} className="text-primary-600" />
                                        <span>Course Duration</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{data.curriculum.duration}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                                        <BarChart size={18} className="text-primary-600" />
                                        <span>Course Level</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{data.level}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                                        <Monitor size={18} className="text-primary-600" />
                                        <span>Students Enrolled</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{data.students.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                                        <FileText size={18} className="text-primary-600" />
                                        <span>Language</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{data.language}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                                        <Captions size={18} className="text-primary-600" />
                                        <span>Subtitle Language</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{data.subtitles}</span>
                                </div>
                            </div>

                            {/* Buttons */}
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
                            <div className="mb-8">
                                <h4 className="font-bold text-gray-900 mb-4 text-sm">This course includes:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Monitor className="text-primary-500" size={18} />
                                        <span>Lifetime access</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Award className="text-primary-500" size={18} />
                                        <span>30-days money-back guarantee</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <File size={18} className="text-primary-500" />
                                        <span>Free exercises file & downloadable resources</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Award className="text-primary-500" size={18} />
                                        <span>Shareable certificate of completion</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Smartphone className="text-primary-500" size={18} />
                                        <span>Access on mobile, tablet and TV</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Captions className="text-primary-500" size={18} />
                                        <span>English subtitles</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <Globe className="text-primary-500" size={18} />
                                        <span>100% online course</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Share */}


                        </div>
                    </div>

                </div>
            </div>


            {/* --- Related Courses Section --- */}
            <div className="bg-white border-t border-gray-200 py-16">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8">Related Courses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {RELATED_COURSES.map((course) => (
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
                                className="h-full"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
