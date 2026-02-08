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
            <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden">
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
            <div className="w-full lg:w-[58%] flex flex-col items-start justify-center p-6 md:p-12 lg:p-20 lg:pl-[12%] overflow-y-auto bg-white">
                <div className="max-w-md w-full py-8">
                    <div className="mb-10 text-left">
                        <h2 className="text-4xl font-extrabold text-primary-900 mb-3 tracking-tight">Create your account</h2>
                        <p className="text-gray-500 font-medium text-lg">Join 67.1k+ students learning with us</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Full Name Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="e.g. Rahul"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="rounded-xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-primary-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="e.g. Sharma"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="rounded-xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-primary-500"
                                />
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mobile Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="10-digit mobile number"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className={`rounded-xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-primary-500 ${errors.phone ? "border-red-500" : ""}`}
                            />
                            {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.phone}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`rounded-xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-primary-500 ${errors.email ? "border-red-500" : ""}`}
                            />
                            {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email}</p>}
                        </div>

                        {/* Passwords Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 relative">
                                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 chars"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="rounded-xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-primary-500 pr-10"
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
                            <div className="space-y-2 relative">
                                <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Confirm</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Repeat password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="rounded-xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-primary-500 pr-10"
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
                        {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.confirmPassword}</p>}

                        {/* Terms Checkbox */}
                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="terms" className="w-4 h-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500" required />
                            <Label htmlFor="terms" className="text-xs text-gray-500 font-medium mb-0">
                                I Agree with the <Link href="/terms" className="text-primary-900 font-bold hover:underline">Terms & Conditions</Link>
                            </Label>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-[#0A1D47] text-white text-sm rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#061330] transition-all disabled:opacity-50 mt-2"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            {!loading && <span className="text-lg">→</span>}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500 font-medium">
                        Already have an account?{' '}
                        <Link href="/signin" className="text-accent-600 font-bold hover:underline">Sign In</Link>
                    </p>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                            <span className="bg-white px-4 text-gray-400">Sign up with</span>
                        </div>
                    </div>

                    <GoogleButton onClick={handleGoogleLogin} />
                </div>
            </div>
        </div>
    );
}

