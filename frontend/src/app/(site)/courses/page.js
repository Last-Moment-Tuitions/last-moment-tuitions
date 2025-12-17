'use client';

import React, { useState } from 'react';
import {
    Search, Filter, ChevronDown,
    LayoutGrid, List, Star,
    Code, Briefcase, Monitor, PenTool, BookOpen, GraduationCap, Building2
} from 'lucide-react';
import {
    Button, CourseCard,
    Accordion, AccordionItem, AccordionTrigger, AccordionContent,
    Badge
} from '@/components/ui';

// Mock Data - 15 items to show 5 rows on desktop (3 cols) with WORKING images
const COURSES = [
    {
        id: 1,
        title: "Complete Java Programming Masterclass",
        category: "Programming",
        price: 499,
        originalPrice: 1999,
        rating: 4.8,
        students: "15,444",
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop",
        instructor: "Rahul Sharma"
    },
    {
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
        title: "Python for Data Science and Machine Learning",
        category: "Programming",
        price: 699,
        originalPrice: 1299,
        rating: 4.5,
        students: "8,637",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
        instructor: "Arun Kumar"
    },
    {
        id: 6,
        title: "SSC CGL Tier 1 & 2 Comprehensive Course",
        category: "Government",
        price: 1999,
        originalPrice: 3500,
        rating: 4.7,
        students: "33,671",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
        instructor: "SSC Mentors"
    },
    {
        id: 7,
        title: "Data Structures & Algorithms in C++",
        category: "Engineering",
        price: 799,
        originalPrice: 1499,
        rating: 4.8,
        students: "5,444",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
        instructor: "CodeWithHarry"
    },
    {
        id: 8,
        title: "NEET 2024 Biology Crash Course",
        category: "Preparation Exams",
        price: 1299,
        originalPrice: 2499,
        rating: 4.9,
        students: "7,637",
        image: "https://images.unsplash.com/photo-1576091160550-217358c7e618?q=80&w=1000&auto=format&fit=crop",
        instructor: "Dr. Neha"
    },
    {
        id: 9,
        title: "Full Stack Web Development Bootcamp (MERN)",
        category: "Programming",
        price: 2999,
        originalPrice: 5999,
        rating: 4.8,
        students: "11,434",
        image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=1000&auto=format&fit=crop",
        instructor: "DevOps Tech"
    },
    {
        id: 10,
        title: "Railway Group D & NTPC Exams",
        category: "Government",
        price: 899,
        originalPrice: 1899,
        rating: 4.4,
        students: "45,000",
        image: "https://images.unsplash.com/photo-1473649085228-583485e6e4d7?q=80&w=1000&auto=format&fit=crop",
        instructor: "Railway Guru"
    },
    {
        id: 11,
        title: "Thermodynamics for Mechanical Engineers",
        category: "Engineering",
        price: 599,
        originalPrice: 999,
        rating: 4.6,
        students: "3,200",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop",
        instructor: "Mech World"
    },
    {
        id: 12,
        title: "CAT 2024 - Quantitative Aptitude Mastery",
        category: "Preparation Exams",
        price: 1599,
        originalPrice: 2599,
        rating: 4.8,
        students: "8,900",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
        instructor: "MBA Easy"
    },
    {
        id: 13,
        title: "React Native - Build Mobile Apps",
        category: "Programming",
        price: 999,
        originalPrice: 1999,
        rating: 4.7,
        students: "6,700",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000&auto=format&fit=crop",
        instructor: "React Pro"
    },
    {
        id: 14,
        title: "RBI Grade B Officer Phase 1 & 2",
        category: "Government",
        price: 3499,
        originalPrice: 6999,
        rating: 4.9,
        students: "5,600",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1000&auto=format&fit=crop",
        instructor: "Finance Hub"
    },
    {
        id: 15,
        title: "Digital Logic Design for Computer Engineering",
        category: "Engineering",
        price: 499,
        originalPrice: 999,
        rating: 4.5,
        students: "4,100",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
        instructor: "CS Basics"
    }
];

const CATEGORIES = [
    { id: 'gov', label: 'Government', count: 42, icon: <Building2 size={18} /> },
    { id: 'eng', label: 'Engineering', count: 85, icon: <LayoutGrid size={18} /> },
    { id: 'prep', label: 'Preparation Exams', count: 34, icon: <GraduationCap size={18} /> },
    { id: 'prog', label: 'Programming', count: 65, icon: <Code size={18} /> },
];

export default function CoursesPage() {
    const [viewMode, setViewMode] = useState('grid');

    return (
        <div className="bg-gray-50 min-h-screen py-8 font-sans">
            <div className="container mx-auto px-4">

                {/* Top Section: Title & Search */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Explore Courses</h1>

                    {/* Search & Suggestions */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                            <div className="relative w-full md:w-1/2 lg:w-1/3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search for courses..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                                <span className="text-sm text-gray-500 whitespace-nowrap">Suggestions:</span>
                                {['SSC CGL', 'JEE Mains', 'Python', 'Banking'].map((tag) => (
                                    <Badge key={tag} variant="accent" className="cursor-pointer hover:bg-accent-200">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Meta Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 font-medium">
                            Showing <span className="text-gray-900 font-bold">{COURSES.length}</span> courses
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Sort by:</span>
                                <div className="relative">
                                    <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer text-sm font-medium">
                                        <option>Most Popular</option>
                                        <option>Newest</option>
                                        <option>Highest Rated</option>
                                        <option>Price: Low to High</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex bg-white rounded-lg border border-gray-200 p-1 gap-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <LayoutGrid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
                        <div className="sticky top-24 space-y-6">

                            {/* Filter Accordion */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="font-bold text-lg flex items-center gap-2">
                                        <Filter size={20} /> Filters
                                    </h2>
                                    <button className="text-sm text-primary-600 hover:underline font-medium">Reset</button>
                                </div>

                                <Accordion type="multiple" defaultValue={['category', 'rating']} className="w-full">

                                    {/* Category Filter */}
                                    <AccordionItem value="category">
                                        <AccordionTrigger>Category</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-3">
                                                {CATEGORIES.map((cat) => (
                                                    <label key={cat.id} className="flex items-center justify-between group cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all" />
                                                            <span className="text-gray-700 group-hover:text-primary-700 transition-colors">{cat.label}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{cat.count}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Rating Filter */}
                                    <AccordionItem value="rating">
                                        <AccordionTrigger>Rating</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-3">
                                                {[5, 4, 3].map((star) => (
                                                    <label key={star} className="flex items-center gap-3 cursor-pointer group">
                                                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={16}
                                                                    className={`${i < star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} transition-colors`}
                                                                />
                                                            ))}
                                                            <span className="text-sm text-gray-600 ml-2 group-hover:text-gray-900">& Up</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                </Accordion>
                            </div>

                        </div>
                    </aside>

                    {/* Main Content Grid */}
                    <main className="flex-1">
                        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                            {COURSES.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    title={course.title}
                                    category={course.category}
                                    price={course.price}
                                    oldPrice={course.originalPrice}
                                    rating={course.rating}
                                    students={course.students}
                                    image={course.image}
                                    instructor={course.instructor}
                                    id={course.id}
                                    className="h-full"
                                />
                            ))}
                        </div>

                        {/* Pagination (Mock) */}
                        <div className="mt-12 flex justify-center gap-2">
                            <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-full" disabled>
                                &lt;
                            </Button>
                            <Button variant="primary" size="sm" className="w-10 h-10 p-0 rounded-full">
                                1
                            </Button>
                            <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full">
                                2
                            </Button>
                            <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full">
                                3
                            </Button>
                            <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full">
                                ...
                            </Button>
                            <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full">
                                8
                            </Button>
                            <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-full">
                                &gt;
                            </Button>
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}
