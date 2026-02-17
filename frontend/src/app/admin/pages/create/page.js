'use client';

import { useState, useEffect, Suspense } from 'react';
import { adminService } from '@/services/adminService';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui';
import { Save, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function CreatePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        metaDescription: '',
        type: 'page', // Default
        folder: null, // Default
    });

    useEffect(() => {
        const typeParam = searchParams.get('type');
        const folderParam = searchParams.get('folder');

        setFormData(prev => ({
            ...prev,
            type: typeParam === 'template' ? 'template' : 'page',
            folder: (folderParam && folderParam !== 'null') ? folderParam : null
        }));
    }, [searchParams]);

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        const currentSlug = formData.slug;
        const generated = generateSlug(title);

        if (!currentSlug || currentSlug === generateSlug(formData.title)) {
            setFormData(prev => ({ ...prev, title, slug: generated }));
        } else {
            setFormData(prev => ({ ...prev, title }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            if (!payload.folder) {
                delete payload.folder;
            }
            const data = await adminService.createPage(payload);
            if (data && data._id) {
                const newPageId = data._id;
                toast.success('Page created successfully!');
                // Keep loading state active during redirect
                setTimeout(() => {
                    router.push(`/editor/${newPageId}`);
                }, 300);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to create page');
            setLoading(false);
        }
        // Don't set loading to false here - keep it active until redirect
    };

    const isTemplate = formData.type === 'template';

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Create {isTemplate ? 'Template' : 'Page'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Configure the settings for your new content.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Type Selection - Minimal Segments */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Type</label>
                        <div className="flex p-1 bg-gray-100/80 rounded-lg w-fit">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'page' })}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${!isTemplate
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Standard Page
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'template' })}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${isTemplate
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Global Template
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">
                                {isTemplate ? 'Template Name' : 'Page Title'}
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={handleTitleChange}
                                className="block w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm placeholder:text-gray-400"
                                placeholder={isTemplate ? "e.g. Exam Header Theme" : "e.g. Summer Bootcamp 2025"}
                                disabled={loading}
                            />
                        </div>

                        {/* Slug Input - Fixed Group Styling */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">
                                {isTemplate ? 'ID' : 'Slug'}
                            </label>
                            <div className="relative flex items-center w-full border border-gray-200 rounded-lg shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all overflow-hidden bg-white">
                                <span className="flex-shrink-0 pl-4 pr-2 text-gray-500 text-sm font-mono select-none bg-white">
                                    {isTemplate ? '#' : '/'}
                                </span>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="block w-full py-2.5 pr-4 text-sm border-none focus:ring-0 focus:outline-none font-mono placeholder:text-gray-300"
                                    placeholder={isTemplate ? "header-theme-v1" : "summer-bootcamp"}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">Description</label>
                            <textarea
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                className="block w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm min-h-[100px] resize-y placeholder:text-gray-400"
                                placeholder="Optional description..."
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            disabled={loading}
                            className="text-gray-600 hover:text-black hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !formData.title || !formData.slug}
                            className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-gray-200 transition-all transform active:scale-95"
                        >
                            {loading ? 'Creating...' : 'Create & Edit'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CreatePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreatePageContent />
        </Suspense>
    );
}
