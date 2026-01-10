'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCourseForm } from '../../hooks/useCourseForm';
import BasicInformation from './steps/BasicInformation';
import AdvanceInformation from './steps/AdvanceInformation';
import CourseCurriculum from './steps/CourseCurriculum';
import PublishCourse from './steps/PublishCourse';
import { Layers, FileText, Video, CheckCircle } from 'lucide-react';
import { coursesApi } from '@/services/courses.api';

export default function CreateCourseWizard({ initialData }) {
    const router = useRouter();
    const { course, updateCourseInfo, addNode, updateNode, deleteNode, moveNode, activeItemId, selectItem } = useCourseForm(initialData);
    const [currentStep, setCurrentStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [courseId, setCourseId] = useState(initialData?._id || null);

    const steps = [
        { id: 0, title: 'Basic Information', icon: Layers, component: BasicInformation },
        { id: 1, title: 'Advance Information', icon: FileText, component: AdvanceInformation },
        { id: 2, title: 'Curriculum', icon: Video, component: CourseCurriculum },
        { id: 3, title: 'Publish Course', icon: CheckCircle, component: PublishCourse },
    ];

    const handleNext = async () => {
        // Auto-save before moving to next step
        await handleSave(false);

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSave = async (showNotification = true) => {
        try {
            setSaving(true);

            // Transform data for backend (snake_case)
            const courseData = {
                title: course.title || 'Untitled Course',
                subtitle: course.subtitle || '',
                category: course.category || 'Uncategorized',
                sub_category: course.subCategory || null,
                level: course.level || 'beginner',
                duration: course.duration || '',
                thumbnail: course.thumbnail || '',
                trailer: course.trailer || '',
                descriptions: course.descriptions || '',
                what_to_learn: course.whatToLearn || [],
                target_audience: course.targetAudience || [],
                requirements: course.requirements || [],
                tags: course.tags || [],
                welcome_message: course.welcomeMessage || '',
                congratulations_message: course.congratulationsMessage || '',
                price: course.price || 0,
                original_price: course.originalPrice || 0,
            };

            let savedCourse;

            if (courseId) {
                // Update existing course
                const response = await coursesApi.updateCourse(courseId, courseData);
                savedCourse = response.data;
            } else {
                // Create new course
                const response = await coursesApi.createCourse(courseData);
                savedCourse = response.data;
                setCourseId(savedCourse._id);
            }

            // Save curriculum if exists
            if (course.content && course.content.length > 0 && savedCourse._id) {
                await coursesApi.updateCourseContent(savedCourse._id, course.content);
            }

            if (showNotification) {
                alert('Course saved successfully!');
            }

            return savedCourse;
        } catch (error) {
            console.error('Failed to save course:', error);
            alert('Failed to save course. Please try again.');
            return null;
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        try {
            setSaving(true);

            // Save first
            const savedCourse = await handleSave(false);
            if (!savedCourse) {
                return;
            }

            // Then publish
            await coursesApi.publishCourse(savedCourse._id);

            alert('Course published successfully!');
            router.push('/admin/courses');
        } catch (error) {
            console.error('Failed to publish course:', error);
            alert('Failed to publish course. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const CurrentComponent = steps[currentStep].component;

    return (
        <div className="w-full">

            {/* Steps Header */}
            <div className="bg-white border-b border-gray-100 mb-8">
                <div className="flex max-w-[1200px] mx-auto">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = currentStep === index;
                        const isCompleted = currentStep > index;

                        return (
                            <button
                                key={index}
                                onClick={() => setCurrentStep(index)}
                                className={`flex items-center gap-2 px-8 py-5 border-b-2 transition-all ${isActive
                                    ? 'border-primary-600 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                                <span className="font-medium text-base">{step.title}</span>
                                {index === 0 && (
                                    <span className={`ml-2 text-xs font-medium px-1.5 py-0.5 rounded ${isActive ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        7/12
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="max-w-[1200px] mx-auto px-6 pb-20">
                <CurrentComponent
                    data={course}
                    updateData={updateCourseInfo}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onSave={() => handleSave(true)}
                    onPublish={handlePublish}
                    saving={saving}
                    // Props for Curriculum Builder (will be ignored by others)
                    addNode={addNode}
                    updateNode={updateNode}
                    deleteNode={deleteNode}
                    moveNode={moveNode}
                    activeItemId={activeItemId}
                    selectItem={selectItem}
                />
            </div>

        </div>
    );
}
