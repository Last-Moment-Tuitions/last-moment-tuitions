'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import React from 'react';
import {
    Search, Bell, ChevronDown,
    Star, CreditCard, Copy,
    MoreVertical, ArrowUpRight
} from 'lucide-react';

// Simple Icon wrapper for Activity
const MessageIcon = ({ className }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
);

const mockData = {
    user: {
        name: 'Vako Shvili',
        email: 'vako.shvili@gmail.com',
        avatar: 'https://github.com/shadcn.png', // Placeholder
        role: 'Instructor'
    },

    recentActivity: [
        { user: 'Kevin', action: 'comments on your lecture "What is ux"', time: 'Just now', icon: MessageIcon, color: 'bg-orange-500' },
        { user: 'John', action: 'give a 5 star rating on your course', time: '5 mins ago', icon: Star, color: 'bg-yellow-500' },
        { user: 'Sraboni', action: 'purchase your course', time: '6 mins ago', icon: CreditCard, color: 'bg-green-500' },
        { user: 'Sraboni', action: 'purchase your course', time: '6 mins ago', icon: CreditCard, color: 'bg-green-500' },
    ],
    ratings: [
        { stars: 5, percent: 56 },
        { stars: 4, percent: 37 },
        { stars: 3, percent: 8 },
        { stars: 2, percent: 1 },
        { stars: 1, percent: 0 },
    ]
};



export function Dashboard() {
    return (
        <div className="bg-white min-h-screen">
            {/* Top Header */}
            <header className="h-[80px] px-8 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500">Good Morning</p>
                </div>

                <div className="flex items-center gap-6">
                    {/* Search */}
                    <div className="relative w-[320px] hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="What do you want to learn..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Notification */}
                    <button className="relative p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary-500 rounded-full border border-white"></span>
                    </button>

                    {/* Profile */}
                    <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                        <img
                            src={mockData.user.avatar}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border border-gray-100"
                        />
                    </div>
                </div>
            </header>

            <div className="p-8 space-y-8 max-w-[1600px] mx-auto">





                {/* 3. Main Grid (Charts & Activity) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Col: Activity & Revenue */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Revenue Chart Placeholder */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 h-[400px] flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Revenue</h3>
                                <select className="bg-gray-50 border-none text-xs rounded text-gray-500 px-2 py-1">
                                    <option>This Month</option>
                                </select>
                            </div>
                            {/* SVG Mock for Line Chart */}
                            <div className="flex-1 relative w-full h-full flex items-end px-4 gap-2 border-l border-b border-gray-100">
                                <svg viewBox="0 0 500 200" className="w-full h-full absolute bottom-0 left-0 text-primary-500 stroke-current stroke-2 fill-none overflow-visible">
                                    <path d="M0,150 C50,150 50,100 100,100 C150,100 150,180 200,160 C250,140 250,50 300,80 C350,110 350,120 400,100 C450,80 450,20 500,50" />
                                    <circle cx="250" cy="95" r="4" className="fill-white stroke-primary-600 stroke-[3px]" />
                                    {/* Tooltip Mock */}
                                    {/* <rect x="220" y="40" width="60" height="30" rx="4" className="fill-gray-900" /> 
                                     <text x="250" y="60" textAnchor="middle" className="fill-white text-xs">$7,443</text> */}
                                </svg>
                                {/* X-Axis Labels */}
                                <div className="absolute -bottom-6 w-full flex justify-between text-xs text-gray-400">
                                    <span>Aug 01</span><span>Aug 10</span><span>Aug 20</span><span>Aug 31</span>
                                </div>
                            </div>
                        </div>

                        {/* Course Overview Chart Placeholder */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 h-[400px] flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Course Overview</h3>
                                <select className="bg-gray-50 border-none text-xs rounded text-gray-500 px-2 py-1">
                                    <option>This Week</option>
                                </select>
                            </div>
                            {/* SVG Mock for Dual Line Chart */}
                            <div className="flex-1 relative w-full h-full px-4 border-l border-b border-gray-100">
                                <svg viewBox="0 0 500 200" className="w-full h-full absolute bottom-0 left-0 stroke-2 fill-none overflow-visible" preserveAspectRatio="none">
                                    <path d="M0,180 Q100,100 200,150 T400,120 T500,80" className="stroke-orange-500" />
                                    <path d="M0,150 Q100,180 200,100 T400,150 T500,50" className="stroke-primary-500" />
                                </svg>
                                <div className="absolute -bottom-6 w-full flex justify-between text-xs text-gray-400">
                                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Col: Profile View, Activity, Rating */}
                    <div className="space-y-8">

                        {/* Profile View (Bar Chart) */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 h-[320px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Profile View</h3>
                                <select className="bg-gray-50 border-none text-xs rounded text-gray-500 px-2 py-1">
                                    <option>Today</option>
                                </select>
                            </div>
                            <div className="h-[220px] flex items-end justify-between gap-1">
                                {[30, 60, 45, 80, 50, 70, 40].map((h, i) => (
                                    <div key={i} className="w-8 bg-gray-50 rounded-t group relative hover:bg-gray-100 transition-colors flex-1 mx-1">
                                        <div
                                            className="absolute bottom-0 w-full bg-primary-100 group-hover:bg-primary-500 transition-all rounded-t"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl border border-gray-100 p-0 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">Recent Activity</h3>
                                <span className="text-xs text-gray-400">Today</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {mockData.recentActivity.map((act, i) => (
                                    <div key={i} className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                        <div className={`p-2 rounded-full text-white shrink-0 ${act.color}`}>
                                            <act.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                <span className="font-bold text-gray-900">{act.user}</span> {act.action}
                                            </p>
                                            <span className="text-xs text-gray-400 mt-1 block">{act.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Overall Rating */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Overall Course Rating</h3>
                                <select className="bg-gray-50 border-none text-xs rounded text-gray-500 px-2 py-1">
                                    <option>This week</option>
                                </select>
                            </div>

                            <div className="flex gap-6 items-center">
                                <div className="text-center p-6 bg-orange-50 rounded-xl">
                                    <div className="text-4xl font-bold text-gray-900 mb-1">4.6</div>
                                    <div className="flex text-orange-400 text-xs gap-0.5 justify-center mb-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        <Star className="w-3 h-3 fill-current" />
                                        <Star className="w-3 h-3 fill-current" />
                                        <Star className="w-3 h-3 fill-current" />
                                        <Star className="w-3 h-3 opacity-50" />
                                    </div>
                                    <div className="text-xs text-gray-500">Overall Rating</div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {mockData.ratings.map((r, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                            <div className="flex items-center gap-1 w-10 text-gray-400">
                                                <Star className="w-3 h-3 text-orange-400 fill-current" /> {r.stars}
                                            </div>
                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-400 rounded-full" style={{ width: `${r.percent}%` }}></div>
                                            </div>
                                            <span className="w-8 text-right text-gray-500">{r.percent}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="pt-8 text-center text-sm text-gray-500 flex justify-between border-t border-gray-100 mt-12 pb-4">
                    <span>© 2021 - Eduguard. Designed by Templatecookie. All rights reserved</span>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-gray-900">FAQs</a>
                        <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900">Terms & Condition</a>
                    </div>
                </footer>

            </div>
        </div>
    );
}
