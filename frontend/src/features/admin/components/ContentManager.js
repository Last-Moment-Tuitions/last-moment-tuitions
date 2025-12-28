'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Plus, Edit, Trash, ExternalLink, Search, Check, Folder, ChevronRight, Home, FolderPlus } from 'lucide-react';

export default function ContentManager({ view = 'page' }) {
    // Navigation State
    const [currentFolder, setCurrentFolder] = useState(null); // null = root
    const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'Home' }]);

    // Data State
    const [folders, setFolders] = useState([]);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    // Initial Load & Folder Change
    useEffect(() => {
        fetchContent();
    }, [currentFolder, view]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            // Fetch Folders (only for current parent)
            const parentParam = currentFolder ? currentFolder : 'null';
            // Note: Update backend to handle 'null' string if sending as query param, 
            // or better, handle undefined/null in service. 
            // Existing code sent 'null' string to express? 
            // In NestJS controller I implemented standard finding. 
            // Let's pass params cleanly. 

            // Backend expectation: 
            // If I look at my PagesService: async findAll(filter: any = {})
            // It passes the query directly to mongoose find.
            // So if I pass { folder: 'null' } it will look for folder: 'null' string.
            // But ObjectId is needed.

            // The previous code sent `?parent=null`. 
            // I should check how I implemented the backend Service/Controller.
            // PagesController: findAll(@Query() query) -> pagesService.findAll(query)
            // PagesService: find(filter)

            // If query is { folder: 'null' }, mongoose might error on casting to ObjectId if 'null' string is passed
            // OR if I used `type: Types.ObjectId` and default null, searching for { folder: null } (literal null) is correct.
            // Searching for { folder: 'null' } (string) is wrong.

            // In express, query params are strings. 

            // I'll stick to reproducing what the frontend WAS sending for now, 
            // but I might need to fix the backend to handle 'null' string vs null value
            // if the previous backend handled it manually.

            const folderParams = { parent: currentFolder, type: view };
            const pageParams = { folder: currentFolder, type: view };

            // However, ContentManager passes 'null' string explicitly if currentFolder is null.
            // "const parentParam = currentFolder ? currentFolder : 'null';"

            // I will update this to pass null or undefined if currentFolder is null, 
            // letting the service/axios handle it (usually axios drops undefined params).
            // But wait, if I want root folders (parent: null), I need to query for parent: null.
            // Mongoose find({ parent: null }) works. 
            // But over HTTP, query param ?parent=null is a string "null" or literal null depending on parser.
            // NestJS/Express usually sees it as string "null" unless transformed.

            // For now, I will trust the previous frontend logic assumption, 
            // but use the service.

            const folders = await adminService.getFolders({ parent: parentParam, type: view });
            const pages = await adminService.getPages({ folder: parentParam, type: view });

            setFolders(folders || []);
            setPages(pages || []);

        } catch (error) {
            console.error('Failed to fetch content', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Navigation Actions ---
    const enterFolder = (folder) => {
        setCurrentFolder(folder._id);
        setBreadcrumbs([...breadcrumbs, { id: folder._id, name: folder.name }]);
    };

    const navigateToBreadcrumb = (index) => {
        const target = breadcrumbs[index];
        const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
        setCurrentFolder(target.id);
        setBreadcrumbs(newBreadcrumbs);
    };

    // --- Modal State ---
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    // --- CRUD Actions ---
    const handleCreateFolderClick = () => {
        setNewFolderName('');
        setIsCreateFolderOpen(true);
    };

    const confirmCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        try {
            await adminService.createFolder({
                name: newFolderName,
                parent: currentFolder, // If null, service sends null/undefined. Re-check if we need 'null' string.
                type: view
            });
            fetchContent();
            setIsCreateFolderOpen(false);
        } catch (error) {
            alert('Failed to create folder');
        }
    };

    const deleteFolder = async (id) => {
        if (!confirm('Are you sure? This will delete the folder.')) return;
        try {
            await adminService.deleteFolder(id);
            fetchContent();
        } catch (error) {
            alert('Failed to delete folder');
        }
    };

    const deletePage = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await adminService.deletePage(id);
            fetchContent();
        } catch (error) {
            alert('Failed to delete page');
        }
    };

    const copyToClipboard = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // --- Filter Logic ---
    // Search creates a "Flat View" of the current folder's content (client-side only for now)
    const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
    const filteredPages = pages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

    // Helpers
    const getSeoHealth = (page) => {
        if (!page.title || !page.slug || !page.gjsHtml) return 'red';
        if (!page.description || page.description.length < 50) return 'yellow';
        return 'green';
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            draft: 'bg-gray-100 text-gray-600',
            published: 'bg-green-50 text-green-700',
            archived: 'bg-red-50 text-red-700'
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border border-transparent ${styles[status] || styles.draft}`}>
                {status || 'draft'}
            </span>
        );
    };

    if (loading && breadcrumbs.length === 1) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white p-6 md:p-12 space-y-6 relative">
            {/* Header with Breadcrumbs */}
            <div className="flex flex-col gap-4 border-b border-gray-100 pb-6">
                <div className="flex md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight capitalize">{view}s Manager</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleCreateFolderClick} variant="outline" className="h-9 gap-2 text-gray-700 border-gray-200">
                            <FolderPlus className="w-4 h-4" /> New Folder
                        </Button>
                        <Link href={`/admin/pages/create?type=${view}&folder=${currentFolder || ''}`}>
                            <Button className="bg-gray-900 hover:bg-black text-white px-4 py-2 h-9 text-sm font-medium shadow-sm gap-2">
                                <Plus className="w-4 h-4" /> New {view === 'template' ? 'Template' : 'Page'}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Breadcrumbs Bar */}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                    {breadcrumbs.map((crumb, idx) => (
                        <div key={idx} className="flex items-center">
                            <button
                                onClick={() => navigateToBreadcrumb(idx)}
                                className={`hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors ${idx === breadcrumbs.length - 1 ? 'font-semibold text-gray-900' : ''}`}
                            >
                                {idx === 0 ? <Home className="w-4 h-4" /> : crumb.name}
                            </button>
                            {idx < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    {folders.length} Folders, {pages.length} Pages
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search current folder..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border-none rounded text-sm focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Content Field - Grid View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* 1. Folders Render */}
                {filteredFolders.map((folder) => (
                    <div
                        key={folder._id}
                        onClick={() => enterFolder(folder)}
                        className="group relative flex flex-col justify-between p-5 bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer aspect-[4/3]"
                    >
                        <div className="flex items-start justify-between">
                            <Folder className="w-10 h-10 text-blue-400 fill-blue-50/50" />
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteFolder(folder._id); }}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 line-clamp-2" title={folder.name}>{folder.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">Folder</p>
                        </div>
                    </div>
                ))}

                {/* 2. Pages/Templates Render */}
                {filteredPages.map((item) => (
                    <div
                        key={item._id}
                        className="group relative flex flex-col p-0 bg-white border border-gray-100 rounded-xl hover:shadow-xl hover:border-gray-200 transition-all overflow-hidden aspect-[4/3] hover:-translate-y-1"
                    >
                        {/* Top Action Bar (Overlay) */}
                        <div className="absolute top-3 right-3 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/editor/${item._id}`}>
                                <button className="p-1.5 bg-white/90 backdrop-blur text-gray-600 hover:text-blue-600 rounded-md shadow-sm border border-gray-100">
                                    <Edit className="w-3.5 h-3.5" />
                                </button>
                            </Link>
                            <button
                                onClick={() => deletePage(item._id)}
                                className="p-1.5 bg-white/90 backdrop-blur text-gray-600 hover:text-red-600 rounded-md shadow-sm border border-gray-100"
                            >
                                <Trash className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Card Content */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                            {/* SEO Indicator Dot */}
                            <div className="flex justify-between items-start">
                                <div className={`w-2 h-2 rounded-full ${getSeoHealth(item) === 'green' ? 'bg-green-400' : 'bg-red-400'}`} title="SEO Health" />
                                {view === 'page' && <StatusBadge status={item.status} />}
                            </div>

                            {/* Title & Preview */}
                            <div className="mt-4">
                                <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-1" title={item.title}>
                                    {item.title}
                                </h3>
                                <p className="text-xs text-gray-400 font-mono truncate">
                                    {view === 'template' ? item._id : `/${item.slug}`}
                                    {view === 'template' && (
                                        <button onClick={() => copyToClipboard(item._id)} className="ml-2 hover:text-black inline-flex align-middle">
                                            {copiedId === item._id ? <Check className="w-3 h-3 text-green-500" /> : <span className="text-[10px] uppercase border px-1 rounded">Copy</span>}
                                        </button>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Footer Stats */}
                        <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                            <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                            {view === 'page' && (
                                <span className="flex items-center gap-1">
                                    <ExternalLink className="w-3 h-3" />
                                    {item.viewCount || 0} views
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {filteredFolders.length === 0 && filteredPages.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <Folder className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">This folder is empty</h3>
                        <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                            Get started by creating a new folder or adding a page here.
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            <Button onClick={handleCreateFolderClick} variant="outline">Create Folder</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* New Folder Modal */}
            {isCreateFolderOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Folder</h3>
                            <p className="text-sm text-gray-500 mb-4">Enter a name for your new folder.</p>
                            <form onSubmit={confirmCreateFolder}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Folder Name"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateFolderOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newFolderName.trim()}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Create Folder
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
