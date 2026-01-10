"use client";

import Link from 'next/link';
import { Mail, Lock, Check } from 'lucide-react';
import { Button, Input, Label, GoogleButton } from '@/components/ui';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import API_BASE_URL from '@/lib/config';
import { supabase } from '@/lib/supabase';

export default function SignInPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

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
            console.error('Google Login Error:', error);
            alert('Failed to initiate Google Login');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
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
                // Store opaque session ID in cookie (secure, path=/)
                document.cookie = `sessionId=${data.accessToken}; path=/; max-age=${data.expiresIn}; SameSite=Lax; Secure`;

                // Update global auth state and redirect
                login(data.user);
            } else {
                const errorData = await res.json();
                alert(`Login failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image & Quote */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 justify-center items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-black/80 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                    alt="Study environment"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="relative z-20 max-w-lg px-12 text-center text-white">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Master Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                            Future
                        </span>
                    </h1>
                    <p className="text-lg text-gray-300 leading-relaxed italic">
                        "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
                    </p>
                    <div className="mt-8 font-semibold text-primary-300 tracking-wide uppercase text-sm">
                        Last Moment Tuitions
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24">
                <div className="max-w-md w-full">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                            <div className="h-10 w-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
                                L
                            </div>
                            <span className="text-xl font-bold text-gray-900">Last Moment Tuitions</span>
                        </Link>

                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
                        <p className="text-gray-500">
                            Please enter your details to sign in
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                icon={<Mail className="h-5 w-5" />}
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock className="h-5 w-5" />}
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="relative flex h-5 w-5 items-center justify-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        className="peer h-5 w-5 appearance-none rounded-md border border-gray-300 bg-white checked:bg-primary-600 checked:border-transparent focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all cursor-pointer"
                                    />
                                    <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                </div>
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none text-gray-600 cursor-pointer select-none"
                                >
                                    Remember me
                                </label>
                            </div>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            className="w-full py-6 text-lg shadow-xl shadow-primary-600/20"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
                        </div>
                    </div>

                    <GoogleButton onClick={handleGoogleLogin} />

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-bold text-primary-600 hover:text-primary-700 hover:underline transition-all">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
