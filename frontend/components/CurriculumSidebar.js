'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, PlayCircle, FileText, Check, Lock, Clock, Play, Pause } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui';

export default function CurriculumSidebar({ curriculum, currentLectureId }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg flex flex-col h-full max-h-[800px] overflow-hidden">

            {/* --- Course Header with Progress --- */}
            <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-2xl text-gray-900 tracking-tight">Course Contents</h3>
                    <span className="text-green-500 font-semibold text-base">15% Completed</span>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden relative">
                    {/* Completed portion - Green */}
                    <div className="absolute left-0 top-0 bottom-0 bg-green-500 w-[15%]" />
                </div>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1 bg-white">
                <Accordion type="single" collapsible className="w-full" defaultValue="s1">
                    {curriculum.map((section, idx) => (
                        <AccordionItem key={section.id} value={section.id} className="border-b border-gray-100 last:border-0">
                            <AccordionTrigger className="px-5 py-5 hover:bg-gray-50 hover:no-underline group bg-gray-50 data-[state=open]:bg-gray-50/50">
                                <div className="flex flex-col gap-1 w-full mr-4">
                                    {/* Section Title */}
                                    <span className="font-medium text-gray-900 text-base text-left">{section.title}</span>

                                    {/* Section Meta */}
                                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 font-normal mt-1">
                                        <div className="flex items-center gap-1.5">
                                            <PlayCircle size={14} className="text-secondary-500" />
                                            <span>{section.lectures} lectures</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-orange-500" />
                                            <span>{section.duration}</span>
                                        </div>
                                        {/* Mocking section completion for design fidelity */}
                                        <div className="flex items-center gap-1.5">
                                            <Check size={14} className="text-green-500" />
                                            <span>25% finish (1/{section.lectures})</span>
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="p-0">
                                <div className="flex flex-col">
                                    {section.items.map((item, itemIdx) => {
                                        const isActive = item.id === currentLectureId;

                                        return (
                                            <React.Fragment key={item.id}>
                                                <Link
                                                    href={`/courses/1/learn/lecture/${item.id}`}
                                                    className={`flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors group ${isActive
                                                        ? 'bg-primary-50'
                                                        : 'hover:bg-gray-50 bg-white'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-4 flex-1">
                                                        {/* Checkbox */}
                                                        <div className={`mt-0.5 w-[18px] h-[18px] shrink-0 border rounded-[2px] flex items-center justify-center transition-colors ${item.completed
                                                            ? 'bg-primary-500 border-primary-500'
                                                            : 'bg-white border-gray-300'
                                                            }`}>
                                                            {item.completed && <Check size={12} className="text-white" strokeWidth={3} />}
                                                        </div>

                                                        {/* Title */}
                                                        <span className={`text-sm font-medium leading-5 ${isActive ? 'text-gray-900 font-medium' : 'text-gray-700'
                                                            }`}>
                                                            {itemIdx + 1}. {item.title}
                                                        </span>
                                                    </div>

                                                    {/* Right Side: Duration & Play/Pause */}
                                                    <div className="flex items-center gap-3 shrink-0 ml-4">
                                                        {isActive ? (
                                                            <div className="flex items-center gap-2 text-gray-900">
                                                                <Pause size={14} fill="currentColor" />
                                                                <span className="text-sm">{item.duration}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-gray-400">
                                                                {item.type === 'note' ? (
                                                                    <FileText size={14} /> // No fill for file icon typically
                                                                ) : (
                                                                    <Play size={14} fill="currentColor" />
                                                                )}
                                                                <span className="text-sm">{item.duration}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>

                                                {/* Attachments (only if present) */}
                                                {item.resources && item.resources.length > 0 && (
                                                    <div className={`px-5 pb-3 pt-0 ${isActive ? 'bg-primary-50' : 'bg-white'}`}>
                                                        <div className="ml-[34px] space-y-2">
                                                            {item.resources.map((res, rIdx) => (
                                                                <div key={rIdx} className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary-600 cursor-pointer">
                                                                    <FileText size={12} />
                                                                    <span>{res.title}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
