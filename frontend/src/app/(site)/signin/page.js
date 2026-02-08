"use client";

import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Label, GoogleButton } from '@/components/ui';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import API_BASE_URL from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleGoogleLogin = async () => {
        const toastId = toast.loading('Initiating Google Sign In...');
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
            toast.error('Failed to initiate Google Sign In', { id: toastId });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Verifying credentials...');
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                document.cookie = `sessionId=${data.accessToken}; path=/; max-age=${data.expiresIn}; SameSite=Lax; Secure`;
                toast.success('Login successful! Welcome back.', { id: toastId });
                login(data.user);
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || 'Login failed', { id: toastId });
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Connection error. Please try again.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans text-gray-900 overflow-hidden">
            {/* Left Side: Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#F8F9FF] items-center justify-center p-12 relative">
                <div className="max-w-lg w-full z-10">
                    <img
                        src="/assets/signin_illustration.png"
                        alt="Join us"
                        className="w-full h-auto drop-shadow-2xl animate-fade-in"
                    />
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 overflow-y-auto">
                <div className="max-w-md w-full py-8">
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-primary-900 mb-2 tracking-tight">Sign In</h2>
                        <p className="text-gray-500 font-medium tracking-tight">Enter your email and password to access your account.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</Label>
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

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</Label>
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

                        <Button
                            variant="primary"
                            className="w-full py-4 text-sm rounded-xl font-bold flex items-center justify-center gap-2 group transition-all"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                            {!loading && <span className="transform group-hover:translate-x-1 transition-transform">→</span>}
                        </Button>
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
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                            <span className="bg-white px-4 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <GoogleButton onClick={handleGoogleLogin} />
                </div>
            </div>
        </div>
    );
}

