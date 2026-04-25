'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
    useInfinitePages,
    useFolders, 
    useCreateFolder, 
    useDeleteFolder, 
    useDeletePage, 
    useUpdatePage 
} from '@/hooks/api/useAdmin';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Plus, Edit, Trash, ExternalLink, Search, Check, Folder, ChevronRight, Home, FolderPlus, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function ContentManager({ view = 'page' }) {
    const { toast } = useToast();

    // Sections are stored as type:template in MongoDB but displayed separately in the UI
    const apiType = view === 'section' ? 'template' : view;
    // Human-readable labels
    const viewLabel = view === 'section' ? 'Section' : view === 'template' ? 'Template' : 'Page';
    const viewLabelPlural = viewLabel + 's';

    // Navigation State
    const [currentFolder, setCurrentFolder] = useState(null); // null = root
    const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'Home' }]);

    // Filter/UI State
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    // TanStack Query
    const folderParams = { parent: currentFolder || 'null', type: view };
    const pageParams = { folder: currentFolder || 'null', type: view, status: 'all' };

    const { data: foldersRaw, isLoading: foldersLoading } = useFolders(folderParams);
    
    // Use Infinite Query for pages
    const { 
        data: pagesInfiniteData, 
        isLoading: pagesLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfinitePages(pageParams, 20);

    const folders = useMemo(() => foldersRaw?.details || foldersRaw || [], [foldersRaw]);
    
    // Flatten the infinite pages data
    const pages = useMemo(() => {
        return pagesInfiniteData?.pages.flatMap(page => Array.isArray(page) ? page : (page.data || [])) || [];
    }, [pagesInfiniteData]);

    const loading = foldersLoading || pagesLoading;

    // Mutations
    const createFolderMutation = useCreateFolder();
    const deleteFolderMutation = useDeleteFolder();
    const deletePageMutation = useDeletePage();
    const updatePageMutation = useUpdatePage();

    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);


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

    // --- Modal Logic ---
    // (State moved to Filter/UI State section)

    // --- CRUD Actions ---
    const handleCreateFolderClick = () => {
        setNewFolderName('');
        setIsCreateFolderOpen(true);
    };

    const confirmCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        try {
            await createFolderMutation.mutateAsync({
                name: newFolderName,
                parent: currentFolder,
                type: view
            });
            setIsCreateFolderOpen(false);
        } catch (error) {
            toast.error(error.message || 'Failed to create folder');
        }
    };

    const deleteFolder = async (id) => {
        const confirmed = await toast.confirm('Are you sure? This will delete the folder.');
        if (!confirmed) return;

        setDeletingId(id);
        try {
            await deleteFolderMutation.mutateAsync(id);
        } catch (error) {
            toast.error(error.message || 'Failed to delete folder');
        } finally {
            setDeletingId(null);
        }
    };

    const deletePage = async (id) => {
        const confirmed = await toast.confirm('Are you sure you want to delete this item?');
        if (!confirmed) return;

        setDeletingId(id);
        try {
            await deletePageMutation.mutateAsync(id);
        } catch (error) {
            toast.error(error.message || 'Failed to delete page');
        } finally {
            setDeletingId(null);
        }
    };

    const togglePublish = async (e, page) => {
        e.stopPropagation(); // Prevent card click
        setTogglingId(page._id);
        try {
            const newStatus = page.status === 'published' ? 'draft' : 'published';
            await updatePageMutation.mutateAsync({ id: page._id, data: { status: newStatus } });
        } catch (error) {
            toast.error(error.message || 'Failed to update status');
        } finally {
            setTogglingId(null);
        }
    };

    const copyToClipboard = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // --- Infinite Scroll Logic ---
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        const sentinel = document.getElementById('infinite-scroll-sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => {
            if (sentinel) observer.unobserve(sentinel);
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight capitalize">{viewLabelPlural} Manager</h1>
                        {view === 'section' && (
                            <p className="text-sm text-gray-500 mt-0.5">Reusable sections available in the page editor block panel</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleCreateFolderClick} variant="outline" className="h-9 gap-2 text-gray-700 border-gray-200">
                            <FolderPlus className="w-4 h-4" /> New Folder
                        </Button>
                        {/* Sections route to create page with type=template so they're stored correctly */}
                        <Link href={`/admin/pages/create?type=${apiType}&folder=${currentFolder || ''}`}>
                            <Button className="bg-gray-900 hover:bg-black text-white px-4 py-2 h-9 text-sm font-medium shadow-sm gap-2">
                                <Plus className="w-4 h-4" /> New {viewLabel}
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
                    {folders.length} Folders, {pages.length} {viewLabelPlural}
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
                                    disabled={deletingId === folder._id}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deletingId === folder._id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash className="w-4 h-4" />
                                    )}
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
                            <button
                                onClick={(e) => togglePublish(e, item)}
                                title={item.status === 'published' ? 'Unpublish' : 'Publish'}
                                disabled={togglingId === item._id}
                                className={`p-1.5 backdrop-blur rounded-md shadow-sm border border-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${item.status === 'published'
                                    ? 'bg-green-50/90 text-green-600 hover:bg-green-100 hover:text-green-700'
                                    : 'bg-white/90 text-gray-400 hover:text-gray-900'
                                    }`}
                            >
                                {togglingId === item._id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    item.status === 'published' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />
                                )}
                            </button>
                            <Link href={`/admin/editor/${item._id}`}>
                                <button className="p-1.5 bg-white/90 backdrop-blur text-gray-600 hover:text-blue-600 rounded-md shadow-sm border border-gray-100">
                                    <Edit className="w-3.5 h-3.5" />
                                </button>
                            </Link>
                            <button
                                onClick={() => deletePage(item._id)}
                                disabled={deletingId === item._id}
                                className="p-1.5 bg-white/90 backdrop-blur text-gray-600 hover:text-red-600 rounded-md shadow-sm border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deletingId === item._id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Trash className="w-3.5 h-3.5" />
                                )}
                            </button>
                        </div>

                        {/* Card Content */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                            {/* SEO Indicator Dot */}
                            <div className="flex justify-between items-start">
                                <div className={`w-2 h-2 rounded-full ${getSeoHealth(item) === 'green' ? 'bg-green-400' : 'bg-red-400'}`} title="SEO Health" />
                                <StatusBadge status={item.status} />
                            </div>

                            {/* Title & Preview */}
                            <div className="mt-4">
                                <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-1" title={item.title}>
                                    {item.title}
                                </h3>
                                <p className="text-xs text-gray-400 font-mono truncate">
                                    {view === 'page' ? `/${item.slug}` : item.category ? `category: ${item.category}` : item._id}
                                    {(view === 'template' || view === 'section') && (
                                        <button onClick={() => copyToClipboard(item._id)} className="ml-2 hover:text-black inline-flex align-middle">
                                            {copiedId === item._id ? <Check className="w-3 h-3 text-green-500" /> : <span className="text-[10px] uppercase border px-1 rounded">Copy ID</span>}
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
                            {view === 'section' && item.category && (
                                <span className="flex items-center gap-1 text-orange-500 font-medium">
                                    <span className="uppercase tracking-wide text-[10px]">{item.category}</span>
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Infinite Scroll Sentinel */}
                {pages.length > 0 && (
                    <div id="infinite-scroll-sentinel" className="col-span-full h-10 flex items-center justify-center">
                        {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-primary-600" />}
                    </div>
                )}

                {/* Empty State */}
                {filteredFolders.length === 0 && filteredPages.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <Folder className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No {viewLabelPlural.toLowerCase()} yet</h3>
                        <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                            {view === 'section'
                                ? 'Create reusable sections that appear as blocks in the page editor.'
                                : 'Get started by creating a new folder or adding a page here.'}
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            <Button onClick={handleCreateFolderClick} variant="outline">Create Folder</Button>
                            <Link href={`/admin/pages/create?type=${apiType}&folder=${currentFolder || ''}`}>
                                <Button className="bg-gray-900 text-white">New {viewLabel}</Button>
                            </Link>
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
                                        disabled={!newFolderName.trim() || createFolderMutation.isPending}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {createFolderMutation.isPending ? 'Creating...' : 'Create Folder'}
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
