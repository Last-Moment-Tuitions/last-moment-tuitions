import React, { useState } from 'react';
import { Save, ArrowLeft, Code, Layout } from 'lucide-react';
import { Button } from '@/components/ui';
import Link from 'next/link';

import { useCourseForm } from '../../hooks/useCourseForm';
import CourseOutline from './CourseOutline';
import CourseSettings from './CourseSettings';
import LessonEditor from './LessonEditor';
import JsonPreview from './JsonPreview';

export default function CourseBuilder({ initialData }) {
    const {
        course,
        activeItemId,
        activeItemType,
        updateCourseInfo,
        addNode,
        updateNode,
        deleteNode,
        selectItem,
        getActiveData
    } = useCourseForm(initialData);

    const [viewMode, setViewMode] = useState('builder'); // 'builder' | 'json'

    const handleSave = () => {
        console.log("SAVING COURSE DATA:", JSON.stringify(course, null, 2));
        alert("Recursive structure logged to console!");
    };

    const activeData = getActiveData();

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
                {/* Left */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/courses" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">{course.title || "Untitled Course"}</h1>
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Deep Nesting Enabled</span>
                    </div>
                </div>

                {/* Center: View Switcher */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('builder')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'builder' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <Layout size={16} /> Builder
                    </button>
                    <button
                        onClick={() => setViewMode('json')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'json' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <Code size={16} /> JSON View
                    </button>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    <Button onClick={handleSave} size="sm" className="gap-2">
                        <Save size={16} /> Save Course
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">

                {viewMode === 'builder' ? (
                    <>
                        {/* LEFT: Outline Sidebar */}
                        <div className="w-[340px] shrink-0 h-full overflow-hidden border-r border-gray-200">
                            <CourseOutline
                                course={course}
                                activeItemId={activeItemId}
                                onSelect={selectItem}
                                onAddNode={addNode}
                                onDeleteNode={deleteNode}
                            />
                        </div>

                        {/* RIGHT: Editor Area */}
                        <div className="flex-1 overflow-y-auto h-full p-8 bg-gray-50/50">
                            <div className="max-w-4xl mx-auto bg-white min-h-full shadow-sm border border-gray-200 rounded-xl p-8 transition-all">
                                {activeItemType === 'settings' && (
                                    <CourseSettings course={course} updateInfo={updateCourseInfo} />
                                )}

                                {/* Generic Node Editor */}
                                {(activeItemType === 'folder' || activeItemType === 'file') && (
                                    <LessonEditor node={activeData} onUpdate={updateNode} />
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    /* JSON Preview Mode */
                    <div className="flex-1 p-8 bg-gray-900 overflow-hidden">
                        <div className="h-full max-w-5xl mx-auto">
                            <JsonPreview data={course} />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
