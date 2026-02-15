"use client";

import Link from 'next/link';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Label, GoogleButton } from '@/components/ui';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API_BASE_URL from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [mounted, setMounted] = useState(false);

    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const validateForm = () => {
        const newErrors = {};

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }

        if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = "Invalid 10-digit mobile number";
        }

        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (errors[e.target.id]) {
            setErrors({ ...errors, [e.target.id]: null });
        }
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
            console.error('Google Sign Up Error:', error);
            toast.error('Failed to initiate Google Sign Up');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                }),
            });

            if (res.ok) {
                toast.success('Account created successfully! Redirecting to sign in...');
                setTimeout(() => {
                    router.push('/signin');
                }, 2000);
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast.error('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans text-gray-900 overflow-hidden">
            {/* Left Side: Illustration */}
            <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden bg-[#E8E4F3]">
                <img
                    src="/assets/signup_illustration.png"
                    alt="Learning Illustration"
                    className="absolute inset-0 w-full h-full object-cover z-10 animate-fade-in"
                />
                {/* Decorative background elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/40 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-100/40 rounded-full blur-[100px]"></div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-[58%] flex flex-col items-start justify-center p-6 md:p-12 lg:p-16 lg:pl-[10%] overflow-y-auto bg-white">
                <div className="max-w-md w-full py-6">
                    <div className="mb-8 text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create your account</h2>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Full Name Label */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Full Name *</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="First name..."
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="rounded-md border-gray-200 bg-white h-11 text-sm placeholder:text-gray-400 focus-visible:ring-primary-500"
                                />
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Last name"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="rounded-md border-gray-200 bg-white h-11 text-sm placeholder:text-gray-400 focus-visible:ring-primary-500"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="10-digit mobile number"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className={`rounded-md border-gray-200 bg-white h-11 text-sm placeholder:text-gray-400 focus-visible:ring-primary-500 ${errors.phone ? "border-red-500" : ""}`}
                            />
                            {errors.phone && <p className="text-xs text-red-500 font-medium ml-1">{errors.phone}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email address"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`rounded-md border-gray-200 bg-white h-11 text-sm placeholder:text-gray-400 focus-visible:ring-primary-500 ${errors.email ? "border-red-500" : ""}`}
                            />
                            {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email}</p>}
                        </div>

                        {/* Password and Confirm Password */}
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="rounded-md border-gray-200 bg-white h-11 text-sm placeholder:text-gray-400 focus-visible:ring-primary-500 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="rounded-md border-gray-200 bg-white h-11 text-sm placeholder:text-gray-400 focus-visible:ring-primary-500 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-500 font-medium ml-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-2 pt-1">
                            <input type="checkbox" id="terms" className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" required />
                            <Label htmlFor="terms" className="text-xs text-gray-600 font-normal mb-0 leading-relaxed">
                                I Agree with all of your <Link href="/terms" className="text-primary-600 font-medium hover:underline">Terms & Conditions</Link>
                            </Label>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-primary-700 text-white text-sm rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-primary-800 transition-all disabled:opacity-50 mt-4 shadow-sm"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            {!loading && <span className="text-base">→</span>}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-medium tracking-wider">
                            <span className="bg-white px-3 text-gray-500">SIGN UP WITH</span>
                        </div>
                    </div>

                    {/* Google Sign In Button - Centered */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="flex items-center justify-center gap-2 py-2.5 px-6 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

