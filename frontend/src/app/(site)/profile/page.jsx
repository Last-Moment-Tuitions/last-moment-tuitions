'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Upload, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button, Input, Label } from '@/components/ui';

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('Dashboard');

    const tabs = ['Dashboard', 'Courses', 'Teachers', 'Message', 'Wishlist', 'Purchase History', 'Settings'];

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20 font-sans">
            {/* Top peach background area */}
            <div className="h-48 bg-[#ffeae3] w-full"></div>

            <div className="container mx-auto px-4 -mt-24 max-w-6xl">
                {/* Profile Header Card */}
                <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-100">
                    <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                                <img
                                    src={user?.profilePhoto || "/assets/default-avatar.svg"}
                                    alt="Profile"
                                    onError={(e) => { e.currentTarget.src = "/assets/default-avatar.svg"; }}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">{user?.firstName} {user?.lastName || ''}</h1>
                                <p className="text-sm text-gray-500 font-medium tracking-wide">{user?.email}</p>
                            </div>
                        </div>
                        <Button
                            className="bg-[#ffeae3] text-primary-600 hover:bg-[#ffdfd4] rounded-sm py-2 px-6 shadow-none flex items-center gap-2 group whitespace-nowrap focus:ring-0 active:scale-100 disabled:opacity-100 hover:translate-y-0"
                            style={{ background: '#ffeae3', color: '#f26d3d' }}
                            onClick={() => { }}
                        >
                            <span style={{ color: '#f26d3d' }}>Contact Support</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: '#f26d3d' }} />
                        </Button>
                    </div>

                    {/* Tabs */}
                    <div className="px-8 overflow-x-auto hide-scrollbar">
                        <div className="flex gap-8 border-t border-gray-100 min-w-max">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-2 text-sm font-semibold transition-all relative ${activeTab === tab
                                        ? 'text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#f26d3d' }} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white p-8 rounded-b-xl shadow-sm min-h-[500px]">
                    {activeTab === 'Settings' ? (
                        <div className="bg-transparent max-w-5xl mx-auto">

                            {/* Account Settings Section */}
                            <div className="mb-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Account settings</h2>

                                <div className="flex flex-col lg:flex-row gap-8 items-start">
                                    {/* Left Side - Image Upload */}
                                    <div className="w-full lg:w-[35%] xl:w-1/3 bg-white p-6 rounded-sm border border-gray-200 flex flex-col items-center justify-center text-center">
                                        <div className="relative w-full aspect-square max-w-[200px] mb-4 group overflow-hidden bg-gray-100">
                                            <img
                                                src={user?.profilePhoto || "/assets/default-avatar.svg"}
                                                alt="Profile"
                                                onError={(e) => { e.currentTarget.src = "/assets/default-avatar.svg"; }}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-black/60 opacity-90 transition-opacity flex flex-col items-center justify-center py-2 cursor-pointer h-1/3">
                                                <div className="flex items-center gap-2 text-white text-sm font-semibold">
                                                    <Upload className="w-4 h-4" />
                                                    <span>Upload Photo</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                                            Image size should be under 1MB and image ration needs to be 1:1
                                        </p>
                                    </div>

                                    {/* Right Side - Form */}
                                    <div className="w-full lg:w-[65%] xl:w-2/3 bg-transparent">
                                        <div className="space-y-6">
                                            <div>
                                                <Label>Full name</Label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Input placeholder="First name" defaultValue={user?.firstName || ''} className="rounded-sm border-gray-200 focus-visible:ring-primary-500 focus-visible:border-primary-500" />
                                                    <Input placeholder="Last name" defaultValue={user?.lastName || ''} className="rounded-sm border-gray-200 focus-visible:ring-primary-500 focus-visible:border-primary-500" />
                                                </div>
                                            </div>

                                            <div>
                                                <Label>Phone Number</Label>
                                                <Input placeholder="Enter your phone number" defaultValue={user?.phone || ''} className="rounded-sm border-gray-200 focus-visible:ring-primary-500 focus-visible:border-primary-500" />
                                            </div>

                                            <div>
                                                <Label>Email</Label>
                                                <Input type="email" placeholder="Email address" defaultValue={user?.email || ''} className="rounded-sm border-gray-200 focus-visible:ring-primary-500 focus-visible:border-primary-500" />
                                            </div>


                                            <div>
                                                <Button className="rounded-sm shadow-none font-semibold px-8 py-3 text-white transition-all transform-none focus:ring-0 active:scale-100 hover:-translate-y-0" style={{ backgroundColor: '#f26d3d' }}>
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-10 border-gray-100" />

                            {/* Change Password Section */}
                            <div className="pb-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Change password</h2>

                                <div className="max-w-xl space-y-6">
                                    <div>
                                        <Label>Current Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showCurrentPassword ? "text" : "password"}
                                                placeholder="Password"
                                                className="rounded-sm border-gray-200 pr-10 focus-visible:ring-primary-500 focus-visible:border-primary-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <Label>New Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="Password"
                                                className="rounded-sm border-gray-200 pr-10 focus-visible:ring-primary-500 focus-visible:border-primary-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Confirm Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm new password"
                                                className="rounded-sm border-gray-200 pr-10 focus-visible:ring-primary-500 focus-visible:border-primary-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <Button className="rounded-sm shadow-none font-semibold px-8 py-3 text-white transition-all transform-none focus:ring-0 active:scale-100 hover:-translate-y-0" style={{ backgroundColor: '#f26d3d' }}>
                                            Change Password
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Dummy placeholder for other tabs */
                        <div className="bg-white rounded-sm text-center text-gray-500 py-20 flex flex-col items-center justify-center h-full">
                            <h3 className="text-xl font-medium mb-2">{activeTab}</h3>
                            <p className="text-sm">Content for {activeTab} will be displayed here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
