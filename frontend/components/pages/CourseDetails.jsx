import React, { useState } from 'react';
import {
    Star,
    PlayCircle,
    FileText,
    Download,
    Award,
    Globe,
    Clock,
    Monitor,
    Smartphone,
    CheckCircle,
    ChevronRight,
    ChevronDown,
    Share2,
    Heart,
    MoreHorizontal,
    FolderOpen
} from 'lucide-react';
import { Button, Card, Badge, Tabs, Accordion } from '@/components/ui';

const CourseDetails = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="hover:text-primary cursor-pointer">Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="hover:text-primary cursor-pointer">Development</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="hover:text-primary cursor-pointer">Web Development</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-primary font-medium">Webflow</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Content) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Header Section */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                            Complete Website Responsive Design: from Figma to Webflow to Website Design
                        </h1>
                        <p className="text-lg text-gray-600">
                            3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing.
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    <img src="https://i.pravatar.cc/100?img=33" alt="Instructor" className="w-10 h-10 rounded-full border-2 border-white" />
                                    <img src="https://i.pravatar.cc/100?img=47" alt="Instructor" className="w-10 h-10 rounded-full border-2 border-white" />
                                </div>
                                <div>
                                    <span className="text-gray-500">Created by</span>
                                    <div className="font-medium text-gray-900">Kevin Powell, Angela Yu</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                                <span className="font-bold text-gray-900">4.8</span>
                                <span className="text-gray-500">(451,444 ratings)</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-700">
                                <span className="font-medium">265,768</span> Students
                            </div>
                        </div>
                    </div>

                    {/* Video Preview */}
                    <div className="relative rounded-2xl overflow-hidden aspect-video group cursor-pointer shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                            alt="Course Preview"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                <PlayCircle className="w-8 h-8 text-primary fill-current ml-1" />
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="border-b border-gray-200">
                        <div className="flex gap-8">
                            {['Overview', 'Curriculum', 'Instructor', 'Reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`pb-4 text-base font-medium transition-colors relative ${activeTab === tab.toLowerCase()
                                        ? 'text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab.toLowerCase() && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content: Overview */}
                    <div className="space-y-8">

                        {/* Description */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Description</h2>
                            <div className="text-gray-600 space-y-4 leading-relaxed">
                                <p>
                                    It gives you a huge self-satisfaction when you look at your work and say, "I made this!". I love that feeling after I'm done working on something. When I lean back in my chair, look at the final result with a smile, and have this little "spark joy" moment.
                                </p>
                                <p>
                                    It's especially satisfying when I know I just made $5,000. I do! And that's why I got into this field. Not for the love of Web Design, which I do now. But for the LIFESTYLE! There are many ways one can achieve this lifestyle. This is my way.
                                </p>
                                <p>
                                    I haven't gone to an art school or have a computer science degree. I'm an outsider to this field who hacked himself into it, somehow ending up being a sought-after professional. That's how I'm going to teach you Web Design.
                                </p>
                            </div>
                        </div>

                        {/* What you will learn */}
                        <div className="bg-green-50/50 border border-green-100 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">What you will learn in this course</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "You will learn how to design beautiful websites using Figma",
                                    "Build complex websites within two weeks",
                                    "Learn to design websites with Figma",
                                    "Make a living freelancing",
                                    "Winning proposal template included",
                                    "Build a stunning portfolio website"
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Requirements */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-900">Course requirements</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
                                <li>No previous experience needed.</li>
                                <li>A computer with internet access.</li>
                                <li>Passion to learn and create.</li>
                            </ul>
                        </div>

                        {/* Curriculum */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-gray-900">Curriculum</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><FolderOpen className="w-4 h-4" /> 6 Sections</span>
                                    <span className="flex items-center gap-1"><PlayCircle className="w-4 h-4" /> 202 Lectures</span>
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 19h 37m</span>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                                {[
                                    { title: "Getting Started", lectures: 8, time: "55m" },
                                    { title: "Figma Essentials", lectures: 24, time: "3h 15m" },
                                    { title: "Webflow Basics", lectures: 18, time: "2h 45m" },
                                    { title: "Building the Portfolio", lectures: 42, time: "6h 10m" },
                                    { title: "Freelancing 101", lectures: 12, time: "1h 30m" }
                                ].map((section, idx) => (
                                    <div key={idx} className="group">
                                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                                                <span className="font-semibold text-gray-900">{section.title}</span>
                                            </div>
                                            <div className="text-sm text-gray-500 flex gap-4">
                                                <span>{section.lectures} lectures</span>
                                                <span>{section.time}</span>
                                            </div>
                                        </div>
                                        {/* Expanded Content Mockup for first item */}
                                        {idx === 0 && (
                                            <div className="bg-white px-6 py-4 space-y-3">
                                                {[
                                                    { title: "Introduction to the course", time: "05:30", type: "video" },
                                                    { title: "Tools you will need", time: "02:15", type: "video" },
                                                    { title: "Course resources", time: "00:45", type: "file" }
                                                ].map((lecture, lIdx) => (
                                                    <div key={lIdx} className="flex items-center justify-between text-sm group/lecture cursor-pointer">
                                                        <div className="flex items-center gap-3 text-gray-700 group-hover/lecture:text-primary">
                                                            {lecture.type === 'video' ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                            <span>{lecture.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-primary text-xs bg-primary/10 px-2 py-0.5 rounded hidden group-hover/lecture:inline-block">Preview</span>
                                                            <span className="text-gray-500">{lecture.time}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900">Instructor</h3>
                            <div className="bg-white border border-gray-200 rounded-2xl p-8">
                                <div className="flex gap-6 items-start">
                                    <img src="https://i.pravatar.cc/150?img=33" alt="Kevin Powell" className="w-24 h-24 rounded-full object-cover" />
                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">Kevin Powell</h4>
                                            <p className="text-gray-500">Web Developer & CSS Evangelist</p>
                                        </div>

                                        <div className="flex gap-6 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-accent-500 fill-current" />
                                                <span className="font-medium text-gray-900">4.8</span> Rating
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4 text-primary" />
                                                <span className="font-medium text-gray-900">45,123</span> Reviews
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-primary" />
                                                <span className="font-medium text-gray-900">265,768</span> Students
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <PlayCircle className="w-4 h-4 text-primary" />
                                                <span className="font-medium text-gray-900">12</span> Courses
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            I'm a web developer and teacher who is passionate about helping people learn how to build the web. I believe that understanding the fundamentals is the key to mastering any technology, and that's exactly what I focus on in my courses.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900">Reviews</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-10 h-10 rounded-full" />
                                                <div>
                                                    <div className="font-bold text-gray-900">Student Name</div>
                                                    <div className="flex text-accent-500 text-xs">
                                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">2 weeks ago</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            This course was exactly what I needed. The transition from Figma to Webflow is explained perfectly. Highly recommended!
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full">View All Reviews</Button>
                        </div>

                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">

                        {/* Price Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-xl shadow-gray-100/50 overflow-hidden">
                            {/* Top Image (Mobile only usually, but here we keep it simple or remove if main video is enough. Design shows just content) */}

                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-bold text-gray-900">$57.00</span>
                                        <span className="text-lg text-gray-400 line-through mb-1">$84.00</span>
                                    </div>
                                    <Badge className="bg-primary/10 text-primary px-3 py-1">32% OFF</Badge>
                                </div>

                                <div className="space-y-3">
                                    <Button className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                                        Add to Cart
                                    </Button>
                                    <Button variant="outline" className="w-full h-12 text-lg font-semibold border-2 hover:bg-gray-50 text-gray-700">
                                        Buy Now
                                    </Button>
                                </div>

                                <div className="text-center text-sm text-gray-500">
                                    30-Day Money-Back Guarantee
                                </div>

                                <div className="pt-6 border-t border-gray-100 space-y-4">
                                    <h4 className="font-bold text-gray-900">This course includes:</h4>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex items-center gap-3">
                                            <Monitor className="w-5 h-5 text-primary" />
                                            <span>56 hours on-demand video</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-primary" />
                                            <span>6 articles</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Download className="w-5 h-5 text-primary" />
                                            <span>8 downloadable resources</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Smartphone className="w-5 h-5 text-primary" />
                                            <span>Access on mobile and TV</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Award className="w-5 h-5 text-primary" />
                                            <span>Certificate of completion</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-sm font-medium text-gray-900 cursor-pointer hover:text-primary">
                                        <span>Share this course</span>
                                        <div className="flex gap-4">
                                            <Share2 className="w-5 h-5 text-gray-400 hover:text-primary transition-colors" />
                                            <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Training for Team */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h4 className="font-bold text-gray-900 mb-2">Training 5 or more people?</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Get your team access to 8,000+ top Udemy courses anytime, anywhere.
                            </p>
                            <Button variant="outline" className="w-full text-sm font-semibold">
                                Try Udemy Business
                            </Button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default CourseDetails;
