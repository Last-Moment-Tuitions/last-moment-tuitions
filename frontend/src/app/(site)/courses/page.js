'use client';

import React, { useState, useEffect } from 'react';
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
import { coursesApi } from '@/services/courses.api';

const CATEGORIES = [
    { id: 'gov', label: 'Government', count: 42, icon: <Building2 size={18} /> },
    { id: 'eng', label: 'Engineering', count: 85, icon: <LayoutGrid size={18} /> },
    { id: 'prep', label: 'Preparation Exams', count: 34, icon: <GraduationCap size={18} /> },
    { id: 'prog', label: 'Programming', count: 65, icon: <Code size={18} /> },
];

export default function CoursesPage() {
    const [viewMode, setViewMode] = useState('grid');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await coursesApi.getAllCourses({ status: 'published' });

            // Transform backend data to match CourseCard props
            const transformedCourses = response.data.map(course => ({
                id: course._id,
                title: course.title,
                category: course.category,
                price: course.price / 100, // Convert from paisa to rupees
                originalPrice: course.original_price / 100,
                rating: course.average_rating,
                students: course.enrollment_count.toLocaleString(),
                image: course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
                instructor: course.instructor?.name || 'Unknown Instructor'
            }));

            setCourses(transformedCourses);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
            setError('Failed to load courses. Please try again later.');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen py-8 font-sans">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading courses...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen py-8 font-sans">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button onClick={fetchCourses} variant="primary">
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen py-8 font-sans">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Explore Courses</h1>
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Available</h3>
                            <p className="text-gray-600">Check back soon for new courses!</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                            Showing <span className="text-gray-900 font-bold">{courses.length}</span> courses
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
                            {courses.map((course) => (
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
