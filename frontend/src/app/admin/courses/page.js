'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Plus, BookOpen, MoreVertical, Globe, Lock, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui';
import { 
    useCourses, 
    usePublishCourse, 
    useDeleteCourse, 
    useUpdateCourse 
} from '@/hooks/api/useCourses';

export default function CoursesPage() {
    const [openMenu, setOpenMenu] = useState(null); // course._id or null

    // TanStack Query
    const { data: response, isLoading: loading } = useCourses();
    const courses = response?.data || [];

    const publishMutation = usePublishCourse();
    const updateMutation = useUpdateCourse();
    const deleteMutation = useDeleteCourse();

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = () => setOpenMenu(null);
        if (openMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openMenu]);

    const handleStatusChange = async (courseId, newStatus) => {
        try {
            if (newStatus === 'published') {
                await publishMutation.mutateAsync(courseId);
            } else {
                await updateMutation.mutateAsync({ id: courseId, data: { status: 'draft' } });
            }
        } catch (error) {
            alert('Failed to update course status. Please try again.');
        }
        setOpenMenu(null);
    };

    const handleDelete = async (courseId) => {
        if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
        try {
            await deleteMutation.mutateAsync(courseId);
        } catch (error) {
            alert('Failed to delete course. Please try again.');
        }
        setOpenMenu(null);
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

                            {/* Three Dots Menu */}
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenu(openMenu === course._id ? null : course._id);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {/* Dropdown Menu */}
                                {openMenu === course._id && (
                                    <div
                                        className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-1 overflow-hidden"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Status Section */}
                                        <div className="px-3 py-2 border-b border-gray-100">
                                            <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">Change Status</p>
                                        </div>

                                        {course.status !== 'published' && (
                                            <button
                                                onClick={() => handleStatusChange(course._id, 'published')}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                                            >
                                                <Globe className="w-4 h-4 text-green-500" />
                                                <span>Publish</span>
                                            </button>
                                        )}

                                        {course.status !== 'draft' && (
                                            <button
                                                onClick={() => handleStatusChange(course._id, 'draft')}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Lock className="w-4 h-4 text-gray-500" />
                                                <span>Revert to Draft</span>
                                            </button>
                                        )}

                                        {/* Actions Section */}
                                        <div className="border-t border-gray-100">
                                            <Link
                                                href={`/admin/courses/edit/${course._id}`}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setOpenMenu(null)}
                                            >
                                                <Edit3 className="w-4 h-4 text-gray-500" />
                                                <span>Edit Content</span>
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(course._id)}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete Course</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{course.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <span>{course.enrollment_count || 0} Students</span>
                            <span>•</span>
                            <span className={`capitalize font-medium ${course.status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
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
