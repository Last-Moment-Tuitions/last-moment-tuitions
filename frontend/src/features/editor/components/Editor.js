'use client';

import { useEffect, useRef, useState } from 'react';
import { adminService } from '@/services/adminService';
import { initEditor } from '@/features/editor/core/editor/Manager';
import { loadBlocks } from '@/features/editor/core/blocks/basic';
import { loadAdvancedBlocks } from '@/features/editor/core/blocks/advanced';
import { loadTemplateRefBlock } from '@/features/editor/core/blocks/templateRef';
import '@/features/editor/core/editor/editor.css';
import { Button } from '@/components/ui';
import { Save, ArrowLeft, Eye, EyeOff, Settings } from 'lucide-react';
import Link from 'next/link';

export function Editor({ pageId }) {
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null); // { message, type }
    const [isPreview, setIsPreview] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true); // Default open on desktop

    useEffect(() => {
        if (!pageId) return;

        const editor = initEditor(pageId);
        editorRef.current = editor;

        // Load Blocks
        loadBlocks(editor);
        loadAdvancedBlocks(editor);
        loadTemplateRefBlock(editor);

        let isMounted = true;

        // Fetch Page Data
        const fetchPage = async () => {
            try {
                const page = await adminService.getPage(pageId);
                
                if (!isMounted) return;

                if (page.gjsComponents && (!Array.isArray(page.gjsComponents) || page.gjsComponents.length > 0)) {
                    editor.setComponents(page.gjsComponents);
                } else if (page.gjsHtml) {
                    // Fallback: Parse raw HTML back into editor blocks (handles seeded data)
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = page.gjsHtml;
                    if (page.gjsCss) { tempDiv.innerHTML += `<style>${page.gjsCss}</style>`; }
                    editor.setComponents(tempDiv.innerHTML);
                }
                if (page.gjsStyles && (!Array.isArray(page.gjsStyles) || page.gjsStyles.length > 0)) {
                    editor.setStyle(page.gjsStyles);
                }
                if (page.gjsAssets) {
                    editor.Assets.add(page.gjsAssets);
                }
            } catch (err) {
                if (!isMounted) return;
                console.error("Failed to load page", err);
                showToast(err.message || 'Failed to load page', 'error');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchPage();

        return () => {
            isMounted = false;
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
        try {
            // Correctly serialize GrapesJS data to avoid circular references and massive objects
            const data = {
                gjsComponents: editor.getComponents().toJSON(),
                gjsStyles: editor.getStyle().toJSON(),
                gjsHtml: editor.getHtml(),
                gjsCss: editor.getCss(),
                gjsAssets: editor.Assets.getAll().toJSON(),
            };

            await adminService.updatePage(pageId, data);
            showToast('Page saved successfully!', 'success');
        } catch (error) {
            console.error(error);
            showToast(error.message || 'Failed to save page', 'error');
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
                    <Button 
                        onClick={() => setRightSidebarOpen(!rightSidebarOpen)} 
                        variant="outline" 
                        size="sm" 
                        className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white lg:hidden"
                    >
                        <Settings className="w-4 h-4" />
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

                {/* Properties Sidebar (Right) */}
                <div 
                    className={`
                        absolute lg:relative right-0 top-0 h-full w-64 bg-gray-800 border-l border-gray-700 flex flex-col text-white z-40 transition-transform duration-300 ease-in-out
                        ${isPreview ? 'hidden' : 'flex'}
                        ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                        lg:w-64 lg:block
                    `}
                >
                    {/* Settings / Traits */}
                    <div className="p-3 font-bold text-xs uppercase text-gray-400 border-b border-gray-700 bg-gray-900 flex justify-between items-center">
                        <span>Settings</span>
                        {/* Close button for mobile */}
                        <button onClick={() => setRightSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
                            &times;
                        </button>
                    </div>
                    {/* Added overflow-y-auto to allow scrolling for traits if there are many */}
                    <div id="traits-container" className="p-2 border-b border-gray-700 min-h-[120px] max-h-[50vh] overflow-y-auto"></div>
                    {/* Styles */}
                    <div className="p-3 font-bold text-xs uppercase text-gray-400 bg-gray-900 border-t border-gray-700">Styles</div>
                    <div id="styles-container" className="flex-1 overflow-y-auto pb-8"></div>
                </div>
            </div>
        </div>
    );
}
