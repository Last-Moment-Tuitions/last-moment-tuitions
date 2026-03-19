'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { Upload, Eye, EyeOff, ArrowRight, Loader2, PlayCircle, MonitorPlay, Trophy, Users, ArrowLeft, ShoppingBag, Clock, CheckCircle2, XCircle, ChevronRight, FileText, Mail, Instagram, Linkedin, X } from 'lucide-react';
import { Button, Input, Label } from '@/components/ui';
import API_BASE_URL from '@/lib/config';

export default function ProfilePage() {
    const { user, loading, checkUser } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('Dashboard');
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
    const [showSupport, setShowSupport] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [allCourses, setAllCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (activeTab === 'Purchase History' && user?.email) {
            fetchPurchaseHistory();
        }
        if (activeTab === 'Courses') {
            fetchAllCourses();
        }
    }, [activeTab, user?.email]);

    const fetchPurchaseHistory = async () => {
        setHistoryLoading(true);
        console.log('[ProfilePage] Fetching purchase history for:', user?.email);
        try {
            const sessionId = getSessionId();
            const headers = sessionId ? { 'x-session-id': sessionId } : {};
            const encodedEmail = encodeURIComponent(user.email);

            console.log(`[ProfilePage] Requesting: ${API_BASE_URL}/orders/user/${encodedEmail}`);

            const res = await fetch(`${API_BASE_URL}/orders/user/${encodedEmail}`, {
                method: 'GET',
                headers: {
                    ...headers,
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const responseData = await res.json();
            const orders = responseData.details || responseData;

            console.log('[ProfilePage] Success, fetched orders:', orders?.length || 0);
            setPurchaseHistory(Array.isArray(orders) ? orders : []);
        } catch (error) {
            console.error('[ProfilePage] Error fetching purchase history:', error);
            // Don't show toast for "Failed to fetch" silently to avoid spam if it's a dev server issue
            // but for production or specific tasks it's helpful
            toast.error('Unable to load purchase history. Please check if backend is running.');
        } finally {
            setHistoryLoading(false);
        }
    };

    const fetchAllCourses = async () => {
        setCoursesLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/courses`);
            if (!res.ok) throw new Error('Failed to fetch courses');
            const result = await res.json();
            // NestJS interceptor wraps data in 'data' field here (from courses controller)
            const courses = result.data || result;
            setAllCourses(Array.isArray(courses) ? courses : []);

            // If we have purchase history, we can filter My Courses
            if (purchaseHistory.length === 0 && user?.email) {
                await fetchPurchaseHistory();
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setCoursesLoading(false);
        }
    };

    useEffect(() => {
        // Filter purchased courses by checking common course_id
        if (allCourses.length > 0 && purchaseHistory.length > 0) {
            // Get unique course IDs from orders that are paid or pending_payment
            const purchasedIds = [...new Set(purchaseHistory
                .filter(order => order.status === 'completed' || order.status === 'paid' || order.status === 'pending_payment')
                .map(order => order.course_id))];

            const myEnrolled = allCourses.filter(course => purchasedIds.includes(course._id));
            setMyCourses(myEnrolled);
        }
    }, [allCourses, purchaseHistory]);

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
        <div className="bg-gray-50 min-h-screen pb-20 font-sans overflow-x-hidden">
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
                            <div className="min-w-0 flex-1">
                                <h1 className="text-2xl font-bold text-gray-900 mb-1 truncate">{user?.firstName} {user?.lastName || ''}</h1>
                                <p className="text-sm text-gray-500 font-medium tracking-wide truncate">{user?.email}</p>
                            </div>
                        </div>
                        <Button
                            className="bg-[#eff6ff] text-primary-600 hover:bg-[#ffdfd4] rounded-sm py-2 px-6 shadow-none flex items-center gap-2 group whitespace-nowrap focus:ring-0 active:scale-100 disabled:opacity-100 hover:translate-y-0"
                            style={{ background: '#eff6ff', color: '#063f78' }}
                            onClick={() => setShowSupport(true)}
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
                    {activeTab === 'Courses' ? (
                        <div className="w-full">
                            {/* My Courses Section */}
                            {myCourses.length > 0 && (
                                <div className="mb-12">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="p-2 bg-[#eff6ff] rounded-sm">
                                            <MonitorPlay className="text-[#063f78]" size={20} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {myCourses.map((course) => (
                                            <div key={course._id} className="border border-gray-100 rounded-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                                                <div className="h-44 w-full relative">
                                                    <img src={course.featuredImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80"} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">Purchased</div>
                                                </div>
                                                <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest block mb-1">{course.category || 'Course'}</span>
                                                        <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{course.title}</h4>
                                                    </div>
                                                    <div className="mt-4">
                                                        <button
                                                            onClick={() => router.push(`/courses/${course._id}/learn`)}
                                                            className="w-full py-2.5 bg-[#063f78] text-white font-bold text-sm rounded-sm hover:bg-[#053260] transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            Start Learning <ChevronRight size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <hr className="mt-12 border-gray-100" />
                                </div>
                            )}

                            {/* All Courses / Catalog Section */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-[#eff6ff] rounded-sm">
                                            <ShoppingBag className="text-[#063f78]" size={20} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {myCourses.length > 0 ? 'All Courses' : 'All Courses'}
                                        </h2>
                                    </div>
                                    <div className="text-xs font-bold text-[#063f78] bg-[#eff6ff] px-3 py-1.5 rounded-sm">
                                        {allCourses.length} COURSES
                                    </div>
                                </div>

                                {coursesLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-10 h-10 text-[#063f78] animate-spin mb-4" />
                                        <p className="text-gray-500 font-medium font-sans">Wait a moment, Loading Catalog...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {allCourses.map((course) => {
                                            const isPurchased = myCourses.some(mc => mc._id === course._id);
                                            return (
                                                <div key={course._id} className="border border-gray-100 rounded-sm overflow-hidden flex flex-col group bg-gray-50/30">
                                                    <div className="h-44 w-full relative">
                                                        <img src={course.featuredImage || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80"} alt={course.title} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                                    </div>
                                                    <div className="p-5 flex-1 flex flex-col justify-between bg-white border-t border-gray-50">
                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-[10px] font-bold text-gray-400 capitalize bg-gray-50 px-2 py-0.5 rounded-sm">{course.level || 'Beginner'}</span>
                                                                <span className="text-sm font-bold text-[#063f78]">₹{course.price?.toLocaleString() || '499'}</span>
                                                            </div>
                                                            <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-[#063f78] transition-colors">{course.title}</h4>
                                                        </div>
                                                        <div className="mt-4">
                                                            {isPurchased ? (
                                                                <button
                                                                    onClick={() => router.push(`/courses/${course._id}/learn`)}
                                                                    className="w-full py-2.5 bg-[#eff6ff] text-[#063f78] font-bold text-sm rounded-sm hover:bg-[#ffdfd4] transition-colors flex items-center justify-center gap-2"
                                                                >
                                                                    Start Learning <ChevronRight size={16} />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => router.push(`/courses/${course._id}`)}
                                                                    className="w-full py-2.5 bg-gray-900 text-white font-bold text-sm rounded-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
                                                                >
                                                                    Enroll Now <ArrowRight size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'Dashboard' ? (
                        <div className="w-full">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Dashboard</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                {/* Enrolled Courses */}
                                <div className="bg-[#ecfeff] rounded-sm p-6 flex items-center gap-4">
                                    <div className="bg-white p-3 rounded-sm flex items-center justify-center h-14 w-14 shadow-sm">
                                        <PlayCircle className="text-[#063f78]" size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">957</h3>
                                        <p className="text-sm text-gray-600">Enrolled Courses</p>
                                    </div>
                                </div>
                                {/* Active Courses */}
                                <div className="bg-[#ecfeff] rounded-sm p-6 flex items-center gap-4">
                                    <div className="bg-white p-3 rounded-sm flex items-center justify-center h-14 w-14 shadow-sm">
                                        <MonitorPlay className="text-[#063f78]" size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">6</h3>
                                        <p className="text-sm text-gray-600">Active Courses</p>
                                    </div>
                                </div>
                                {/* Completed Courses */}
                                <div className="bg-[#ecfeff] rounded-sm p-6 flex items-center gap-4">
                                    <div className="bg-white p-3 rounded-sm flex items-center justify-center h-14 w-14 shadow-sm">
                                        <Trophy className="text-[#063f78]" size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">951</h3>
                                        <p className="text-sm text-gray-600">Completed Courses</p>
                                    </div>
                                </div>
                                {/* Course Instructors */}
                                <div className="bg-[#ecfeff] rounded-sm p-6 flex items-center gap-4">
                                    <div className="bg-white p-3 rounded-sm flex items-center justify-center h-14 w-14 shadow-sm">
                                        <Users className="text-[#063f78]" size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">241</h3>
                                        <p className="text-sm text-gray-600">Course Instructors</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Let's start learning, {user?.firstName}</h2>
                                <div className="flex gap-2">
                                    <button className="bg-[#eff6ff] p-2 hover:bg-[#ffe4da] rounded-sm transition-colors">
                                        <ArrowLeft className="text-[#063f78]" size={20} />
                                    </button>
                                    <button className="bg-[#eff6ff] p-2 hover:bg-[#ffe4da] rounded-sm transition-colors">
                                        <ArrowRight className="text-[#063f78]" size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Course 1 */}
                                <div className="border border-gray-200 rounded-sm overflow-hidden flex flex-col relative bg-white pb-[2px]">
                                    <div className="h-40 w-full relative">
                                        <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80" alt="Course" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-xs text-gray-500 mb-1 line-clamp-1">Reiki Level I, II and Master/Teacher Program</h4>
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">1. Introductions</p>
                                        </div>
                                        <div className="mt-4">
                                            <button className="w-full py-2 bg-[#eff6ff] text-[#063f78] font-medium text-sm rounded-sm hover:bg-[#ffe4da] transition-colors">
                                                Watch Lecture
                                            </button>
                                        </div>
                                    </div>
                                    {/* Progress bar empty for first one */}
                                    <div className="h-[2px] bg-gray-100 w-full absolute bottom-0 left-0"></div>
                                </div>

                                {/* Course 2 */}
                                <div className="border border-gray-200 rounded-sm overflow-hidden flex flex-col relative bg-white pb-[2px]">
                                    <div className="h-40 w-full relative">
                                        <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80" alt="Course" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-xs text-gray-500 mb-1 line-clamp-1">The Complete 2021 Web Development Bootcamp</h4>
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">167. What You'll Need to Get Started - Se...</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between gap-4">
                                            <button className="flex-1 py-2 bg-[#063f78] text-[#fff] font-medium text-sm rounded-sm hover:bg-[#ffe4da] transition-colors">
                                                Watch Lecture
                                            </button>
                                            <span className="text-xs font-semibold text-green-500 whitespace-nowrap">61% Completed</span>
                                        </div>
                                    </div>
                                    <div className="h-[2px] w-full bg-gray-100 absolute bottom-0 left-0">
                                        <div className="h-full bg-[#063f78]" style={{ width: '61%' }}></div>
                                    </div>
                                </div>

                                {/* Course 3 */}
                                <div className="border border-gray-200 rounded-sm overflow-hidden flex flex-col relative bg-white pb-[2px]">
                                    <div className="h-40 w-full relative">
                                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" alt="Course" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-xs text-gray-500 mb-1 line-clamp-1">Copywriting - Become a Freelance Copywriter...</h4>
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">1. How to get started with figma</p>
                                        </div>
                                        <div className="mt-4">
                                            <button className="w-full py-2 bg-[#eff6ff] text-[#063f78] font-medium text-sm rounded-sm hover:bg-[#ffe4da] transition-colors">
                                                Watch Lecture
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-[2px] bg-gray-100 w-full absolute bottom-0 left-0"></div>
                                </div>

                                {/* Course 4 */}
                                <div className="border border-gray-200 rounded-sm overflow-hidden flex flex-col relative bg-white pb-[2px]">
                                    <div className="h-40 w-full relative">
                                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80" alt="Course" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-xs text-gray-500 mb-1 line-clamp-1">2021 Complete Python Bootcamp From Zero to...</h4>
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">9. Advanced CSS - Selector Priority</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between gap-4">
                                            <button className="flex-1 py-2 bg-[#063f78] text-[#fff] font-medium text-sm rounded-sm hover:bg-[#e85535] transition-colors">
                                                Watch Lecture
                                            </button>
                                            <span className="text-xs font-semibold text-green-500 whitespace-nowrap">12% Finish</span>
                                        </div>
                                    </div>
                                    <div className="h-[2px] w-full bg-gray-100 absolute bottom-0 left-0">
                                        <div className="h-full bg-[#063f78]" style={{ width: '12%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'Purchase History' ? (
                        <div className="w-full">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Purchase History</h2>
                                    <p className="text-sm text-gray-500 mt-1">Manage and track all your course enrollments and payments.</p>
                                </div>
                                <div className="bg-[#eff6ff] text-[#063f78] px-4 py-2 rounded-sm text-sm font-semibold flex items-center gap-2">
                                    <ShoppingBag size={18} />
                                    <span>{purchaseHistory.length} Orders</span>
                                </div>
                            </div>

                            {historyLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-10 h-10 text-[#063f78] animate-spin mb-4" />
                                    <p className="text-gray-500 font-medium">Fetching your orders...</p>
                                </div>
                            ) : purchaseHistory.length > 0 ? (
                                <div className="overflow-x-auto border border-gray-100 rounded-sm">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order Details</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {purchaseHistory.map((order) => (
                                                <tr key={order.order_id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-gray-900 group-hover:text-[#063f78] transition-colors line-clamp-1">{order.course_title}</span>
                                                            <span className="text-[11px] font-medium text-gray-400 mt-1 flex items-center gap-1.5">
                                                                <FileText size={12} className="text-gray-300" />
                                                                {order.order_id}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Clock size={14} className="text-gray-400" />
                                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-sm font-bold text-gray-900">₹{order.final_amount.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {order.status === 'completed' || order.status === 'paid' ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-100 uppercase tracking-tight">
                                                                <CheckCircle2 size={12} /> Success
                                                            </span>
                                                        ) : order.status === 'pending_payment' ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-tight">
                                                                <Clock size={12} /> Pending
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-100 uppercase tracking-tight">
                                                                <XCircle size={12} /> {order.status}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <button
                                                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#063f78] bg-[#eff6ff] hover:bg-[#ffdfd4] rounded-sm transition-all active:scale-95"
                                                            onClick={() => router.push(`/order-confirmation?order_id=${order.order_id}`)}
                                                            title="View Invoice"
                                                        >
                                                            <FileText size={14} />
                                                            Invoice
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
                                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                                        <ShoppingBag className="text-gray-300" size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No purchases yet</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm">
                                        You haven't purchased any courses yet. Explore our courses to start your learning journey.
                                    </p>
                                    <Button
                                        onClick={() => router.push('/courses')}
                                        className="bg-[#063f78] text-white hover:bg-[#053260] font-bold px-8 py-3 h-auto"
                                    >
                                        Explore Courses
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'Settings' ? (
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

            {/* Contact Support Modal */}
            {showSupport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="bg-[#063f78] p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Contact Support</h3>
                                <p className="text-[#eff6ff]/80 text-xs mt-1">We're here to help you</p>
                            </div>
                            <button 
                                onClick={() => setShowSupport(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Body */}
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.open('mailto:lastmomenttuitions@gmail.com')}>
                                <div className="w-12 h-12 bg-[#eff6ff] rounded-lg flex items-center justify-center text-[#063f78] group-hover:bg-[#063f78] group-hover:text-white transition-all duration-300">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Us</p>
                                    <p className="text-gray-900 font-semibold group-hover:text-[#063f78] transition-colors">lastmomenttuitions@gmail.com</p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.open('https://instagram.com/lastmomenttuition')}>
                                <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                                    <Instagram size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Instagram</p>
                                    <p className="text-gray-900 font-semibold group-hover:text-pink-600 transition-colors">@lastmomenttuition</p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.open('https://www.linkedin.com/in/last-moment-tuitions')}>
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#0a66c2] group-hover:bg-[#0a66c2] group-hover:text-white transition-all duration-300">
                                    <Linkedin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">LinkedIn</p>
                                    <p className="text-gray-900 font-semibold group-hover:text-[#0a66c2] transition-colors">Last Moment Tuitions</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-6 flex justify-center">
                            <button 
                                onClick={() => setShowSupport(false)}
                                className="px-8 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-sm hover:bg-black transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
