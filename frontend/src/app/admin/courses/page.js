'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plus, BookOpen, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui';
import { coursesApi } from '@/services/courses.api';

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            // Fetch ALL courses (draft + published) for admin
            const response = await coursesApi.getAllCourses();
            setCourses(response.data);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                    <p className="text-gray-500 mt-1">Manage all your courses and learning paths.</p>
                </div>
                <Link href="/admin/courses/create">
                    <Button size="sm" className="gap-2">
                        <Plus size={16} /> Create New Course
                    </Button>
                </Link>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                                <BookOpen size={24} />
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{course.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <span>{course.enrollment_count || 0} Students</span>
                            <span>•</span>
                            <span className={`capitalize ${course.status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                                {course.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href={`/admin/courses/edit/${course._id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                    Edit Content
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {courses.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                            <BookOpen size={48} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No courses yet</h3>
                        <p className="mt-1 text-gray-500">Get started by creating your first course.</p>
                        <div className="mt-6">
                            <Link href="/admin/courses/create">
                                <Button>Create Course</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
