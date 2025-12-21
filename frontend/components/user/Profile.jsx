'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, Shield, Edit2, Trash2, Save, X, Loader2, LogOut } from 'lucide-react';

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // 1. Get User ID from LocalStorage (Simulated Session)
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }

        const userData = JSON.parse(storedUser);
        fetchUserData(userData._id);
    }, [router]);

    const fetchUserData = async (id) => {
        try {
            const res = await fetch(`/api/users/${id}`);
            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                setEditForm(data.user);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to load profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (user && user.token) {
            try {
                // Call API to remove token from DB
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: user.token })
                });
            } catch (err) {
                console.error('Logout API failed', err);
            }
        }
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authChange'));
        router.push('/login');
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: editForm.firstName,
                    lastName: editForm.lastName,
                    phone: editForm.phone,
                    // Email update might require verification in real app
                    email: editForm.email
                })
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                setIsEditing(false);
                setMessage({ type: 'success', text: 'Profile updated successfully' });
                // Update local storage to reflect changes across app
                localStorage.setItem('user', JSON.stringify(data.user));
            } else {
                setMessage({ type: 'error', text: data.error || 'Update failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error updating profile' });
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to deactivate your account? This action cannot be undone immediately.')) return;

        try {
            const res = await fetch(`/api/users/${user._id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('Account deactivated.');
                handleLogout();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to deactivate');
            }
        } catch (error) {
            alert('Error removing account');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-500 mt-1">Manage your account settings</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>

            {/* Messages */}
            {message.text && (
                <div className={`p-4 rounded-xl mb-6 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ID Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                        <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                            {user.firstName[0]}{user.lastName ? user.lastName[0] : ''}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                        <p className="text-gray-500 text-sm mb-4">{user.role === 'admin' ? 'Administrator' : 'Student'}</p>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            <Shield size={12} />
                            {user.status.toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Details Form */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">Personal Information</h3>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    <Edit2 size={16} />
                                    Edit Details
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Cancel"
                                    >
                                        <X size={18} />
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                                    >
                                        <Save size={16} />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                    {isEditing ? (
                                        <input
                                            name="firstName"
                                            value={editForm.firstName}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                                            <User size={18} className="text-gray-400" />
                                            {user.firstName}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    {isEditing ? (
                                        <input
                                            name="lastName"
                                            value={editForm.lastName}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                                            <User size={18} className="text-gray-400 opacity-0" />
                                            {user.lastName}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                    {isEditing ? (
                                        <input
                                            name="email"
                                            value={editForm.email}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                                            <Mail size={18} className="text-gray-400" />
                                            {user.email}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone</label>
                                    {isEditing ? (
                                        <input
                                            name="phone"
                                            value={editForm.phone}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                                            <Phone size={18} className="text-gray-400" />
                                            {user.phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Account Actions</h4>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                >
                                    <Trash2 size={16} />
                                    Deactivate Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
