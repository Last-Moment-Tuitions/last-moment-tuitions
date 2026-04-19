'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CourseBuilder from '@/features/admin/courses/components/CourseBuilder/CourseBuilder';
import { useCourseWithContent } from '@/hooks/api/useCourses';
import { fromApiFormat } from '@/features/admin/courses/hooks/useCourseForm';

export default function EditCoursePage() {
    const params = useParams();
    const { id } = params;

    const { data: response, isLoading: loading, error } = useCourseWithContent(id);

    // Transform backend snake_case to frontend camelCase (memoized)
    const courseData = React.useMemo(() => {
        const course = response?.data || response;
        if (!course) return null;
        return fromApiFormat(course);
    }, [response]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading course...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load course</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!courseData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-gray-500">Course not found</p>
            </div>
        );
    }

    return <CourseBuilder initialData={courseData} />;
}
