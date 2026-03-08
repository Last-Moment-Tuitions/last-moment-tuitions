'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { Upload, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { Button, Input, Label } from '@/components/ui';
import API_BASE_URL from '@/lib/config';

export default function ProfilePage() {
    const { user, loading, checkUser } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('Settings');
    const tabs = ['Dashboard', 'Courses', 'Wishlist', 'Purchase History', 'Settings'];

    // Password State
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Profile Photo Upload State
    const fileInputRef = useRef(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // Photo selection handler
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (under 1MB)
        if (file.size > 1024 * 1024) {
            toast.error('Image size should be under 1MB');
            return;
        }

        setSelectedFile(file);
        setPreviewPhoto(URL.createObjectURL(file));
    };

    const getSessionId = () => {
        return document.cookie.split('; ').find(row => row.startsWith('sessionId='))?.split('=')[1];
    };

    // Save profile photo changes
    const handleSaveChanges = async () => {
        if (!selectedFile) {
            toast.warning('No new photo selected to save');
            return;
        }
        setUploadingPhoto(true);

        try {
            const sessionId = getSessionId();
            const headers = { 'x-session-id': sessionId, 'Content-Type': 'application/json' };

            // 1. Get Presigned URL
            let urlRes;
            try {
                urlRes = await fetch(`${API_BASE_URL}/uploads/presigned-url`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        filename: selectedFile.name,
                        contentType: selectedFile.type,
                        category: 'image',
                        size: selectedFile.size
                    })
                });
            } catch (err) {
                console.error("Fetch returned an error trying to get presigned URL:", err);
                throw new Error("Unable to reach backend: " + err.message);
            }

            if (!urlRes.ok) {
                const text = await urlRes.text();
                throw new Error(`presigned-url failed: ${text}`);
            }
            const { data } = await urlRes.json();
            console.log("Presigned URL success:", data);

            // 2. Upload to S3
            let uploadRes;
            try {
                uploadRes = await fetch(data.uploadUrl, {
                    method: 'PUT',
                    body: selectedFile,
                    headers: { 'Content-Type': selectedFile.type }
                });
            } catch (err) {
                console.error("Fetch returned an error trying to PUT to S3:", err);
                throw new Error("Upload blocked locally or by CORS: " + err.message);
            }

            if (!uploadRes.ok) {
                const text = await uploadRes.text();
                throw new Error(`S3 upload failed: ${text}`);
            }

            // 3. Update Database via backend
            let updateRes;
            try {
                updateRes = await fetch(`${API_BASE_URL}/auth/me/profile-photo`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({ profilePhoto: data.publicUrl || data.url || data.fileUrl })
                });
            } catch (err) {
                console.error("Fetch returned an error trying to PATCH profile photo:", err);
                throw new Error("Unable to update DB: " + err.message);
            }

            if (!updateRes.ok) {
                const text = await updateRes.text();
                throw new Error(`DB update failed: ${text}`);
            }

            toast.success('Profile photo updated successfully!');
            setSelectedFile(null);

            // Refresh user data globally
            await checkUser();

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to update profile photo');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!currentPassword) return toast.error('Current password is required');
        if (!newPassword) return toast.error('New password is required');
        if (newPassword !== confirmPassword) return toast.error('New passwords do not match');

        setPasswordLoading(true);
        try {
            const sessionId = getSessionId();
            const res = await fetch(`${API_BASE_URL}/auth/me/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            toast.success('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20 font-sans">
            {/* Top peach background area */}
            <div className="h-48 bg-[#eff6ff] w-full"></div>

            <div className="container mx-auto px-4 -mt-24 max-w-6xl">
                {/* Profile Header Card */}
                <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-100">
                    <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                                <img
                                    src={previewPhoto || user?.profilePhoto || "/assets/default-avatar.svg"}
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
                            className="bg-[#eff6ff] text-primary-600 hover:bg-[#ffdfd4] rounded-sm py-2 px-6 shadow-none flex items-center gap-2 group whitespace-nowrap focus:ring-0 active:scale-100 disabled:opacity-100 hover:translate-y-0"
                            style={{ background: '#eff6ff', color: '#063f78' }}
                            onClick={() => { }}
                        >
                            <span style={{ color: '#063f78' }}>Contact Support</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: '#063f78' }} />
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
                                        <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#063f78' }} />
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
                                                src={previewPhoto || user?.profilePhoto || "/assets/default-avatar.svg"}
                                                alt="Profile"
                                                onError={(e) => { e.currentTarget.src = "/assets/default-avatar.svg"; }}
                                                className="w-full h-full object-cover"
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleFileSelect}
                                            />
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute inset-x-0 bottom-0 bg-black/60 opacity-90 transition-opacity flex flex-col items-center justify-center py-2 cursor-pointer h-1/3 hover:bg-black/70"
                                            >
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
                                                    <Input readOnly disabled value={user?.firstName || ''} className="rounded-sm border-gray-200 bg-gray-50 cursor-not-allowed opacity-70" />
                                                    <Input readOnly disabled value={user?.lastName || ''} className="rounded-sm border-gray-200 bg-gray-50 cursor-not-allowed opacity-70" />
                                                </div>
                                            </div>

                                            <div>
                                                <Label>Phone Number</Label>
                                                <Input readOnly disabled value={user?.phone || ''} className="rounded-sm border-gray-200 bg-gray-50 cursor-not-allowed opacity-70" />
                                            </div>

                                            <div>
                                                <Label>Email</Label>
                                                <Input readOnly disabled type="email" value={user?.email || ''} className="rounded-sm border-gray-200 bg-gray-50 cursor-not-allowed opacity-70" />
                                            </div>

                                            <div>
                                                <Button
                                                    onClick={handleSaveChanges}
                                                    disabled={uploadingPhoto || !selectedFile}
                                                    className="rounded-sm shadow-none font-semibold px-8 py-3 text-white transition-all transform-none focus:ring-0 active:scale-100 hover:-translate-y-0 disabled:opacity-50"
                                                    style={{ backgroundColor: '#063f78' }}
                                                >
                                                    {uploadingPhoto ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                                                        </>
                                                    ) : 'Save Changes'}
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
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
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
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
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
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        <Button
                                            onClick={handlePasswordChange}
                                            disabled={passwordLoading}
                                            className="rounded-sm shadow-none font-semibold px-8 py-3 text-white transition-all transform-none focus:ring-0 active:scale-100 hover:-translate-y-0 disabled:opacity-50"
                                            style={{ backgroundColor: '#063f78' }}
                                        >
                                            {passwordLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Changing...
                                                </>
                                            ) : 'Change Password'}
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
