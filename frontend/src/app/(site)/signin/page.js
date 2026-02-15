"use client";

import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Label, GoogleButton } from '@/components/ui';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import API_BASE_URL from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

export default function SignInPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    const router = useRouter();
    const { login } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Google Sign In Error:', error);
            toast.error('Failed to initiate Google Sign In');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();

                // API returns nested structure: { success, message, details: { accessToken, expiresIn, user } }
                const { accessToken, expiresIn, user } = data.details || {};

                if (!accessToken || !user) {
                    throw new Error('Invalid response from server');
                }

                document.cookie = `sessionId=${accessToken}; path=/; max-age=${expiresIn}; SameSite=Lax; Secure`;
                toast.success('Login successful! Welcome back.', { id: toastId });
                login(user);
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans text-gray-900 overflow-hidden">
            {/* Left Side: Illustration */}
            <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden">
                <img
                    src="/assets/signin_illustration.png"
                    alt="Join us"
                    className="absolute inset-0 w-full h-full object-cover z-10 animate-fade-in"
                />
                {/* Decorative background elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/40 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-100/40 rounded-full blur-[100px]"></div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-[58%] flex flex-col items-start justify-center p-6 md:p-12 lg:p-20 lg:pl-[12%] overflow-y-auto bg-white">
                <div className="max-w-md w-full py-8">
                    <div className="mb-10 text-left">
                        <h2 className="text-4xl font-extrabold text-primary-900 mb-3 tracking-tight">Sign In</h2>
                        <p className="text-gray-500 font-medium text-lg">Enter your email and password to access your account.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="rounded-xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-primary-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</Label>
                                <Link href="/forgot-password" size="sm" className="text-xs font-bold text-accent-600 hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="rounded-xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-primary-500 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-[#0A1D47] text-white text-sm rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#061330] transition-all disabled:opacity-50 mt-2"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                            {!loading && <span className="text-lg">→</span>}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500 font-medium">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-accent-600 font-bold hover:underline">Create Account</Link>
                    </p>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                            <span className="bg-white px-4 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <GoogleButton onClick={handleGoogleLogin} />
                </div>
            </div>
        </div>
    );
}

