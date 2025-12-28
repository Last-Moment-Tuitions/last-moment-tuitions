'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/lib/config';
import { initEditor } from '@/features/editor/core/editor/Manager';
import { loadBlocks } from '@/features/editor/core/blocks/basic';
import { loadAdvancedBlocks } from '@/features/editor/core/blocks/advanced';
import { loadTemplateRefBlock } from '@/features/editor/core/blocks/templateRef';
import '@/features/editor/core/editor/editor.css';
import { Button } from '@/components/ui';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export function Editor({ pageId }) {
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null); // { message, type }
    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        if (!pageId) return;

        const editor = initEditor(pageId);
        editorRef.current = editor;

        // Load Blocks
        loadBlocks(editor);
        loadAdvancedBlocks(editor);
        loadTemplateRefBlock(editor);

        // Fetch Page Data
        const fetchPage = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/pages/id/${pageId}`);
                const page = res.data.data;

                if (page.gjsComponents && page.gjsComponents.length > 0) {
                    editor.loadProjectData({
                        components: page.gjsComponents,
                        styles: page.gjsStyles,
                        assets: page.gjsAssets
                    });
                }
            } catch (err) {
                console.error("Failed to load page", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();

        return () => {
            if (editor) editor.destroy();
        };
    }, [pageId]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = async () => {
        const editor = editorRef.current;
        if (!editor || !pageId) return;

        setSaving(true);
        const data = {
            gjsComponents: editor.getComponents(),
            gjsStyles: editor.getStyle(),
            gjsHtml: editor.getHtml(),
            gjsCss: editor.getCss(),
            gjsAssets: editor.getAssets(),
        };

        try {
            await axios.put(`${API_BASE_URL}/pages/${pageId}`, data);
            showToast('Page saved successfully!', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to save page.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const togglePreview = () => {
        const editor = editorRef.current;
        if (!editor) return;

        if (isPreview) {
            editor.stopCommand('preview');
        } else {
            editor.runCommand('preview');
        }
        setIsPreview(!isPreview);
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden relative">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-20 right-4 z-[100] px-6 py-3 rounded-lg shadow-xl border text-sm font-bold animate-in slide-in-from-right-10 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-500 border-green-600 text-white' : 'bg-red-500 border-red-600 text-white'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Toolbar */}
            <div className={`bg-gray-900 border-b border-gray-800 text-white p-3 flex justify-between items-center z-50 relative ${isPreview ? 'hidden' : ''}`}>
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-bold text-sm uppercase tracking-wider">Page Editor</h1>
                </div>
                <div className="flex gap-2">
                    <Button onClick={togglePreview} variant="outline" size="sm" className="bg-transparent border-gray-700 text-gray-300 hover:text-white gap-2">
                        {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        Preview
                    </Button>
                    <Button onClick={handleSave} disabled={saving} size="sm" className="bg-primary-600 hover:bg-primary-700 gap-2 min-w-[100px]">
                        {saving ? (
                            <>Saving...</>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Save
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Preview Exit Button (Floating) */}
            {isPreview && (
                <div className="fixed top-4 right-4 z-[100]">
                    <Button onClick={togglePreview} className="bg-gray-900 border border-gray-700 text-white shadow-xl gap-2">
                        <EyeOff className="w-4 h-4" /> Exit Preview
                    </Button>
                </div>
            )}

            {/* Editor Area */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Blocks Sidebar */}
                <div className={`w-64 bg-gray-800 border-r border-gray-700 flex flex-col text-white z-40 ${isPreview ? 'hidden' : 'block'}`}>
                    <div className="p-3 font-bold text-xs uppercase text-gray-400">Blocks</div>
                    <div id="blocks" className="flex-1 overflow-y-auto p-2"></div>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-gray-900 relative">
                    <div id="gjs" className="h-full w-full"></div>
                </div>

                {/* Styles Sidebar */}
                <div className={`w-64 bg-gray-800 border-l border-gray-700 flex flex-col text-white z-40 ${isPreview ? 'hidden' : 'block'}`}>
                    <div className="p-3 font-bold text-xs uppercase text-gray-400">Styles</div>
                    <div id="styles-container" className="flex-1 overflow-y-auto"></div>
                </div>
            </div>
        </div>
    );
}
