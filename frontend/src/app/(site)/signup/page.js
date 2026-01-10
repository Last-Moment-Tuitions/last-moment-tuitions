"use client";

import Link from 'next/link';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { Button, Input, Label, GoogleButton } from '@/components/ui';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API_BASE_URL from '@/lib/config';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
            console.error('Google Login Error:', error);
            alert('Failed to initiate Google Login');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: Number(formData.phone) // Ensure it's a number
                }),
            });

            if (res.ok) {
                router.push('/signin');
            } else {
                const errorData = await res.json();
                alert(`Signup failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image & Quote */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 justify-center items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-900/90 to-black/80 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                    alt="Students collaborating"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="relative z-20 max-w-lg px-12 text-center text-white">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Start Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-primary-400">
                            Journey
                        </span>
                    </h1>
                    <p className="text-lg text-gray-300 leading-relaxed italic">
                        "The beautiful thing about learning is that no one can take it away from you."
                    </p>
                    <div className="mt-8 font-semibold text-accent-300 tracking-wide uppercase text-sm">
                        Join the Community
                    </div>
                </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24">
                <div className="max-w-md w-full">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                            <div className="h-10 w-10 bg-gradient-to-br from-accent-600 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-accent-500/30 transition-shadow">
                                L
                            </div>
                            <span className="text-xl font-bold text-gray-900">Last Moment Tuitions</span>
                        </Link>

                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
                        <p className="text-gray-500">
                            Start learning with us today
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex gap-4">
                            <div className="space-y-2 w-1/2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="John"
                                    icon={<User className="h-5 w-5" />}
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2 w-1/2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    icon={<User className="h-5 w-5" />}
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Mobile Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="1234567890"
                                icon={<Phone className="h-5 w-5" />}
                                required
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

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
                                placeholder="Create a password"
                                icon={<Lock className="h-5 w-5" />}
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-gray-500">
                                Must be at least 8 characters long
                            </p>
                        </div>

                        <Button
                            className="w-full py-6 text-lg shadow-xl shadow-accent-600/20 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-4 text-gray-500 font-medium">Or sign up with</span>
                        </div>
                    </div>

                    <GoogleButton onClick={handleGoogleLogin} />

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/signin" className="font-bold text-accent-600 hover:text-accent-700 hover:underline transition-all">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
