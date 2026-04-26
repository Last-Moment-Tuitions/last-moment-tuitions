'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { usePage, useUpdatePage } from '@/hooks/api/useAdmin';
import { initEditor } from '@/features/editor/core/editor/Manager';
import { loadBlocks } from '@/features/editor/core/blocks/basic';
import { loadAdvancedBlocks } from '@/features/editor/core/blocks/advanced';
import { loadTemplateRefBlock } from '@/features/editor/core/blocks/templateRef';
import { loadTemplateBlocks } from '@/features/editor/core/blocks/templateBlocks';
import '@/features/editor/core/editor/editor.css';
import { Button } from '@/components/ui';
import { Save, ArrowLeft, Eye, EyeOff, Settings } from 'lucide-react';
import Link from 'next/link';

export function Editor({ pageId }) {
    const editorRef = useRef(null);
    const [toast, setToast] = useState(null); // { message, type }
    const [isPreview, setIsPreview] = useState(false);
    const [bordersActive, setBordersActive] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true); // Default open on desktop
    const [sidebarWidth, setSidebarWidth] = useState(320); // Default 320px width

    // TanStack Query
    const { data: page, isLoading: loading } = usePage(pageId);
    const updateMutation = useUpdatePage();
    const saving = updateMutation.isPending;

    const pageDetails = page;

    // Resizing logic for right sidebar
    const isResizing = useRef(false);

    const startResizing = useCallback((e) => {
        isResizing.current = true;
        document.body.style.cursor = 'ew-resize';
        e.preventDefault();
    }, []);

    const stopResizing = useCallback(() => {
        isResizing.current = false;
        document.body.style.cursor = 'default';
    }, []);

    const resize = useCallback((e) => {
        if (isResizing.current) {
            const newWidth = window.innerWidth - e.clientX;
            // Constrain between 250px and 800px
            if (newWidth >= 250 && newWidth <= 800) {
                setSidebarWidth(newWidth);
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    const isPlainObject = (value) => {
        if (!value || typeof value !== 'object') return false;
        const proto = Object.getPrototypeOf(value);
        return proto === Object.prototype || proto === null;
    };

    const stripScriptTags = (html = '') => {
        if (typeof html !== 'string' || !html) return html;
        return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    };

    const sanitizeComponentsForCanvas = (input) => {
        if (Array.isArray(input)) {
            return input.map(item => sanitizeComponentsForCanvas(item));
        }

        if (isPlainObject(input)) {
            const clone = { ...input };

            if (typeof clone.content === 'string') {
                clone.content = stripScriptTags(clone.content);
            }

            if (typeof clone.components === 'string') {
                clone.components = stripScriptTags(clone.components);
            } else if (Array.isArray(clone.components) || (clone.components && typeof clone.components === 'object')) {
                clone.components = sanitizeComponentsForCanvas(clone.components);
            }

            return clone;
        }

        return input;
    };

    const toSafeJson = (value) => {
        const seen = new WeakSet();
        return JSON.parse(JSON.stringify(value, (_key, val) => {
            if (typeof val === 'object' && val !== null) {
                if (seen.has(val)) return undefined;
                seen.add(val);
            }
            return val;
        }));
    };

    useEffect(() => {
        if (!pageId) return;

        const editor = initEditor(pageId);
        editorRef.current = editor;

        // Load Blocks (sync)
        loadBlocks(editor);
        loadAdvancedBlocks(editor);
        loadTemplateRefBlock(editor);

        // Load Section/Template Blocks from API (async, non-blocking)
        loadTemplateBlocks(editor);

        // ── Selection Logic ──
        editor.on('component:selected', (model) => {
            if (model && model.get('type') === 'template-ref') {
                const traitsContainer = document.getElementById('traits-container');
                if (traitsContainer) {
                    traitsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    const settingsHeader = traitsContainer.previousElementSibling;
                    if (settingsHeader) {
                        settingsHeader.style.backgroundColor = '#1e40af';
                        setTimeout(() => settingsHeader.style.backgroundColor = '', 1000);
                    }
                }
            }
        });

        return () => {
            if (editor) {
                editor.destroy();
                editorRef.current = null;
            }
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
            const rawComponents = editor.getComponents().toJSON();
            const rawStyles = typeof editor.getStyle()?.toJSON === 'function'
                ? editor.getStyle().toJSON()
                : editor.getStyle();
            const rawAssets = typeof editor.Assets?.getAll()?.toJSON === 'function'
                ? editor.Assets.getAll().toJSON()
                : [];

            const data = toSafeJson({
                gjsComponents: sanitizeComponentsForCanvas(rawComponents),
                gjsStyles: rawStyles,
                gjsHtml: editor.getJs() ? `${editor.getHtml()}\n<script>\n${editor.getJs()}\n</script>` : editor.getHtml(),
                gjsCss: editor.getCss(),
                gjsAssets: rawAssets,
            });

            await updateMutation.mutateAsync({ id: pageId, data });
            showToast('Page saved successfully!', 'success');
            // Bust the module-level template cache for this template ID so any page
            // that imports it will re-fetch the latest content from the database.
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('clear-template-cache', { detail: { id: pageId } }));
            }
        } catch (error) {
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

    const toggleBorders = () => {
        const editor = editorRef.current;
        if (!editor) return;

        if (bordersActive) {
            editor.Commands.stop('sw-visibility');
            editor.Commands.stop('core:component-outline');
            setBordersActive(false);
        } else {
            editor.Commands.run('sw-visibility');
            editor.Commands.run('core:component-outline');
            setBordersActive(true);
        }
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
                    <Link 
                        href={pageDetails?.type === 'template' ? '/admin/templates' : '/admin/pages'} 
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-sm tracking-wider capitalize">
                            {pageDetails ? `${pageDetails.title}` : 'Loading...'}
                        </h1>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                            {pageDetails ? `${pageDetails.type || 'Page'} Editor` : 'Page Editor'}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={toggleBorders} variant="outline" size="sm" className={`gap-2 ${bordersActive ? 'bg-primary-900 border-primary-500 text-primary-200' : 'bg-transparent border-gray-700 text-gray-300 hover:text-white'}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeDasharray="4 4" />
                        </svg>
                        Borders
                    </Button>
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
                {/* Blocks + Layers Sidebar */}
                <div className={`w-64 bg-gray-800 border-r border-gray-700 flex flex-col text-white z-40 ${isPreview ? 'hidden' : 'block'}`}>
                    {/* Blocks Section */}
                    <div className="p-3 font-bold text-xs uppercase text-gray-400 border-b border-gray-700 cursor-pointer flex items-center justify-between"
                        onClick={() => document.getElementById('blocks').classList.toggle('hidden')}>
                        <span>Blocks</span>
                        <span className="text-gray-500">▾</span>
                    </div>
                    <div id="blocks" className="overflow-y-auto p-2" style={{ maxHeight: '50%' }}></div>

                    {/* Layers Section */}
                    <div className="p-3 font-bold text-xs uppercase text-gray-400 border-b border-t border-gray-700 cursor-pointer flex items-center justify-between bg-gray-900"
                        onClick={() => document.getElementById('layers-container').classList.toggle('hidden')}>
                        <span>🗂 Layers</span>
                        <span className="text-gray-500">▾</span>
                    </div>
                    <div id="layers-container" className="flex-1 overflow-y-auto"></div>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-gray-900 relative">
                    <div id="gjs" className="h-full w-full"></div>
                </div>

                {/* Properties Sidebar (Right) */}
                <div
                    className={`
                        absolute lg:relative right-0 top-0 h-full bg-gray-800 border-l border-gray-700 flex flex-col text-white z-40 transition-transform duration-300 ease-in-out
                        ${isPreview ? 'hidden' : 'flex'}
                        ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                    `}
                    style={{ width: rightSidebarOpen ? `${sidebarWidth}px` : '0px', flexShrink: 0 }}
                >
                    {/* Resizer Handle */}
                    <div
                        onMouseDown={startResizing}
                        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-gray-400 z-50 transition-colors bg-transparent opacity-50"
                    />

                    <div className="p-3 font-bold text-xs uppercase text-gray-400 border-b border-gray-700 bg-gray-900 flex justify-between items-center flex-shrink-0">
                        <span>Properties</span>
                        {/* Close button for mobile */}
                        <button onClick={() => setRightSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
                            &times;
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0 pb-12">
                        <div className="p-3 font-bold text-xs uppercase text-gray-400 border-b border-gray-700 bg-gray-800">
                            Settings
                        </div>
                        <div id="traits-container" className="p-2 border-b border-gray-700"></div>

                        <div className="p-3 font-bold text-xs uppercase text-gray-400 border-b border-gray-700 bg-gray-800 mt-2">
                            Styles
                        </div>
                        <div id="styles-container"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
