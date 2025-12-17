'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Search, Bell, User,
    GraduationCap, Crown, Users, Award,
    BookOpen, Book, FileQuestion, FileCheck
} from 'lucide-react';

export default function AdminDashboard() {
    // We'll keep the real data fetching to map to some of these cards
    const [realStats, setRealStats] = useState({
        totalPages: 0,
        totalTemplates: 0,
        totalViews: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/pages/stats');
                if (res.data.success) {
                    const allItems = res.data.data || [];
                    const pages = allItems.filter(p => (p.type || 'page') === 'page');
                    const templates = allItems.filter(p => p.type === 'template');
                    const views = pages.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);

                    setRealStats({
                        totalPages: pages.length,
                        totalTemplates: templates.length,
                        totalViews: views
                    });
                }
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };

        fetchStats();
    }, []);

    // Placeholder Data for the UI
    const statsCards = [
        { title: 'Total Students', value: '3', sub: '100%', icon: GraduationCap, color: 'bg-emerald-50 text-emerald-600' },
        { title: 'Premium Students', value: '0', sub: '0%', icon: Crown, color: 'bg-orange-50 text-orange-600' },
        { title: 'Total Users', value: '2', sub: '100%', icon: Users, color: 'bg-blue-50 text-blue-600' },
        { title: 'Total Roles', value: '1', sub: '100%', icon: Award, color: 'bg-purple-50 text-purple-600' },
        { title: 'Total Subjects', value: realStats.totalPages.toString(), sub: 'From LMS', icon: BookOpen, color: 'bg-indigo-50 text-indigo-600' }, // Mapped to Real Pages
        { title: 'Total Chapters', value: realStats.totalTemplates.toString(), sub: 'From LMS', icon: Book, color: 'bg-pink-50 text-pink-600' }, // Mapped to Real Templates
        { title: 'Total Questions', value: '62', sub: '0%', icon: FileQuestion, color: 'bg-cyan-50 text-cyan-600' },
        { title: 'Total Tests', value: '4', sub: '0%', icon: FileCheck, color: 'bg-rose-50 text-rose-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 space-y-8 font-sans">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Good Afternoon, Super Admin</h1>
                    <p className="text-sm text-gray-500 mt-1">Here is what's happening today.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm"
                        />
                    </div>
                    <button className="p-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 shadow-sm relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="text-right hidden md:block">
                            <div className="text-sm font-semibold text-gray-900">Super Admin</div>
                            <div className="text-xs text-gray-500">admin@lmt.com</div>
                        </div>
                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-md">
                            <User className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.title}</p>
                            <div className="flex items-end gap-2 mt-1">
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                <span className="text-[10px] font-medium px-1.5 py-0.5 bg-green-50 text-green-600 rounded-full mb-1">{stat.sub}</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Report */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-1">Your sales report</h3>
                    <p className="text-sm text-gray-500 mb-6">Look at your sales</p>

                    <div className="text-4xl font-extrabold text-gray-900 tracking-tight">₹4,435.70</div>
                    <div className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        +2,330.00 (+2.5%)
                    </div>

                    <div className="mt-8 flex gap-2">
                        {['1d', '7d', '30d', '16m', 'Max'].map((label, idx) => (
                            <button key={idx} className={`px-3 py-1 text-xs font-medium rounded-full ${idx === 1 ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Students Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-gray-900">Students</h3>
                            <p className="text-sm text-gray-500">3 from last month</p>
                        </div>
                        <button className="text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-gray-100">
                            Month <span className="text-gray-400">▼</span>
                        </button>
                    </div>

                    {/* CSS-only Bar Chart Placeholder */}
                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                        {[30, 45, 25, 60, 75, 50, 40, 30, 90, 65, 55, 80].map((h, i) => (
                            <div key={i} className="w-full bg-orange-50 rounded-t-sm relative group">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-sm transition-all duration-500 group-hover:to-orange-500"
                                    style={{ height: `${h}%` }}
                                ></div>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 font-medium">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
