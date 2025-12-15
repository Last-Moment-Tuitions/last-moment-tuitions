'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { initEditor } from '@/core/editor/Manager';
import { loadBlocks } from '@/core/blocks/basic';
import { loadAdvancedBlocks } from '@/core/blocks/advanced';
import { loadTemplateRefBlock } from '@/core/blocks/templateRef';
import '@/core/editor/editor.css';
import { Button } from '@/components/ui';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditorPage({ params }) {
    const editorRef = useRef(null);
    // Unwrap params Promise because of Next.js 15
    // Note: In client components, params is a prop, but if it is passed from a server component we might need to handle it.
    // However, in standard Next.js 14/15 client page, params is a promise only in Server Components usually?
    // Wait, the previous issue was in a Server Component. 
    // Let's assume params is standard here, but we can wrap in use() or async if needed, 
    // but hooks can't easily be async. Let's just useEffect on params.id if available.

    // Actually, in App Router Client Components: "params is a promise" applies to layouts/pages.
    // Since this is `use client`, we receive `params` as a prop.
    // BUT Next.js 15 might require `use(params)` or awaiting it in the parent? 
    // Let's check simply.

    const [pageId, setPageId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Handle params promise unwrapping manually if needed or just access
        // Ideally we should use `React.use(params)` but that's experimental/new.
        // Let's assume simple access for now, or wrap access.
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setPageId(resolvedParams.id);
        };
        unwrapParams();
    }, [params]);


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
                const res = await axios.get(`http://localhost:3001/api/pages/${pageId}`); // This endpoint normally gets by slug but we can add get by ID
                // Wait, our API: GET /api/pages/:slug. 
                // We should probably allow fetching by ID or Slug. 
                // Let's modify backend to support fetching by ID if the string looks like an ObjectId, or we assume route is [id].

                // Assuming route is `/admin/editor/[id]`
                // And we modify backend to getById.
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

        // Actually, we need to modify backend API access or use the existing "slug" based one?
        // Let's Modify Backend to support ID access on `GET /api/pages/:id` or specifically `GET /api/pages/id/:id`
        // For now, let's assume we implement `GET /api/pages/id/:id` handling

        fetchPage();

        return () => {
            if (editor) editor.destroy();
        };
    }, [pageId]);

    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null); // { message, type }

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
            await axios.put(`http://localhost:3001/api/pages/${pageId}`, data);
            showToast('Page saved successfully!', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to save page.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const [isPreview, setIsPreview] = useState(false);

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
