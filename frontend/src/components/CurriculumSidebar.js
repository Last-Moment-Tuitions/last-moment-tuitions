'use client';

import React from 'react';
import Link from 'next/link';
import { PlayCircle, FileText, Check, Clock, Play, Pause, BookOpen, ClipboardList } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui';

// Helper: format seconds → "MM:SS"
function formatDuration(seconds) {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Get content type icon
function TypeIcon({ type, ...props }) {
    switch (type) {
        case 'video': return <Play {...props} />;
        case 'document': return <FileText {...props} />;
        case 'quiz': return <ClipboardList {...props} />;
        case 'assignment': return <BookOpen {...props} />;
        default: return <Play {...props} />;
    }
}

export default function CurriculumSidebar({ curriculum, currentLectureId, courseId }) {
    // Flatten items for counting
    let totalLectures = 0;
    const walkCount = (nodes) => {
        if (!nodes) return;
        for (const n of nodes) {
            if (n.type === 'file') totalLectures++;
            if (n.children) walkCount(n.children);
        }
    };
    walkCount(curriculum);

    return (
        <div className="bg-white border border-gray-200 rounded-lg flex flex-col h-full max-h-[800px] overflow-hidden">

            {/* Course Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-2xl text-gray-900 tracking-tight">Course Contents</h3>
                </div>
                <p className="text-sm text-gray-500">{totalLectures} lectures</p>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1 bg-white">
                <Accordion type="single" collapsible className="w-full" defaultValue={curriculum?.[0]?.id}>
                    {(curriculum || []).map((section) => {
                        const lectureCount = (section.children || []).filter(c => c.type === 'file').length;

                        return (
                            <AccordionItem key={section.id} value={section.id} className="border-b border-gray-100 last:border-0">
                                <AccordionTrigger className="px-5 py-5 hover:bg-gray-50 hover:no-underline group bg-gray-50 data-[state=open]:bg-gray-50/50">
                                    <div className="flex flex-col gap-1 w-full mr-4">
                                        <span className="font-medium text-gray-900 text-base text-left">{section.title}</span>
                                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 font-normal mt-1">
                                            <div className="flex items-center gap-1.5">
                                                <PlayCircle size={14} className="text-secondary-500" />
                                                <span>{lectureCount} lectures</span>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="p-0">
                                    <div className="flex flex-col">
                                        {(section.children || []).map((item, itemIdx) => {
                                            if (item.type === 'folder') {
                                                // Sub-folder
                                                return (
                                                    <React.Fragment key={item.id}>
                                                        <div className="px-5 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            {item.title}
                                                        </div>
                                                        {(item.children || []).map((subItem, subIdx) => (
                                                            <LessonRow
                                                                key={subItem.id}
                                                                item={subItem}
                                                                index={subIdx}
                                                                courseId={courseId}
                                                                isActive={subItem.id === currentLectureId}
                                                            />
                                                        ))}
                                                    </React.Fragment>
                                                );
                                            }

                                            return (
                                                <LessonRow
                                                    key={item.id}
                                                    item={item}
                                                    index={itemIdx}
                                                    courseId={courseId}
                                                    isActive={item.id === currentLectureId}
                                                />
                                            );
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </div>
    );
}

function LessonRow({ item, index, courseId, isActive }) {
    const contentType = item.data?.type || 'video';
    const duration = item.data?.duration ? formatDuration(item.data.duration) : '';
    const isLocked = item.data?.isLocked !== false;

    return (
        <Link
            href={`/courses/${courseId}/learn/lecture/${item.id}`}
            className={`flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors group ${isActive
                ? 'bg-primary-50'
                : 'hover:bg-gray-50 bg-white'
                }`}
        >
            <div className="flex items-start gap-4 flex-1">
                {/* Checkbox placeholder */}
                <div className={`mt-0.5 w-[18px] h-[18px] shrink-0 border rounded-[2px] flex items-center justify-center transition-colors bg-white border-gray-300`}>
                </div>

                {/* Title */}
                <span className={`text-sm font-medium leading-5 ${isActive ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                    {index + 1}. {item.title}
                </span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 shrink-0 ml-4">
                {isActive ? (
                    <div className="flex items-center gap-2 text-gray-900">
                        <Pause size={14} fill="currentColor" />
                        {duration && <span className="text-sm">{duration}</span>}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                        <TypeIcon type={contentType} size={14} fill="currentColor" />
                        {duration && <span className="text-sm">{duration}</span>}
                    </div>
                )}
            </div>
        </Link>
    );
}
