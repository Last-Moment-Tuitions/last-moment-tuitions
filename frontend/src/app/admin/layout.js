import Link from 'next/link';
import { LayoutDashboard, FileText, Image as ImageIcon, LogOut, GraduationCap, LayoutTemplate } from 'lucide-react';

export default function AdminLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold tracking-tight leading-none uppercase text-gray-400">Admin</h2>
                        <h1 className="text-base font-bold tracking-tight text-white mt-0.5">Last Moment Tuitions</h1>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-6">
                    <div className="space-y-1">
                        <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Overview</div>
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-gray-300 hover:text-white">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                    </div>

                    <div className="space-y-1">
                        <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Manage Content</div>
                        <Link href="/admin/pages" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-gray-300 hover:text-white">
                            <FileText className="w-4 h-4" />
                            Pages
                        </Link>
                        <Link href="/admin/templates" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-gray-300 hover:text-white">
                            <LayoutTemplate className="w-4 h-4" />
                            Templates
                        </Link>
                    </div>

                    <div className="space-y-1">
                        <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Assets</div>
                        <Link href="/admin/media" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-gray-300 hover:text-white">
                            <ImageIcon className="w-4 h-4" />
                            Media Library
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium text-gray-400">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-white">
                {/* Removed padding here to let children control it/full bleed if needed, but added back in specific pages usually */}
                <div className="">
                    {children}
                </div>
            </main>
        </div>
    );
}
