'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CourseBuilder from '@/features/admin/courses/components/CourseBuilder/CourseBuilder';

export default function EditCoursePage() {
    const params = useParams();
    const { id } = params;

    // Mock Data Fetching based on ID
    // UPDATED: Now uses recursive 'content' structure
    const mockCourseData = {
        id: id,
        title: 'Full Stack Web Development',
        description: 'Complete guide to React and Node.js',
        price: 4999,
        level: 'intermediate',
        content: [
            {
                id: 'module_1',
                type: 'folder',
                title: 'Getting Started',
                children: [
                    {
                        id: 'lesson_1',
                        type: 'file',
                        title: 'Course Overview',
                        data: { type: 'video', isLocked: false, content: 'vid_123' }
                    },
                    {
                        id: 'lesson_2',
                        type: 'file',
                        title: 'Setup Environment',
                        data: { type: 'document', isLocked: false, content: 'doc_setup' }
                    }
                ]
            },
            {
                id: 'module_2',
                type: 'folder',
                title: 'React Fundamentals',
                children: [
                    {
                        id: 'submodule_2_1',
                        type: 'folder',
                        title: 'Components Deep Dive',
                        children: [
                            {
                                id: 'lesson_3',
                                type: 'file',
                                title: 'Props vs State',
                                data: { type: 'video', isLocked: true, content: 'vid_react_vars' }
                            }
                        ]
                    }
                ]
            }
        ]
    };

    return <CourseBuilder initialData={mockCourseData} />;
}
