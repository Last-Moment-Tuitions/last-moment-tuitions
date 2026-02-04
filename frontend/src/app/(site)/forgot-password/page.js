"use client";

import Link from 'next/link';
import { Mail, KeyRound, ArrowLeft, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button, Input, Label } from '@/components/ui';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API_BASE_URL from '@/lib/config';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    if (!mounted) return null;

    const handleEmailSubmit = async (e) => {
        e?.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Sending OTP...');

        try {
            const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStep(2);
                setResendTimer(60);
                toast.success('OTP sent successfully!', { id: toastId });
            } else {
                toast.error(data.message || 'Failed to send OTP', { id: toastId });
            }
        } catch (err) {
            toast.error('Connection error. Please try again.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error('Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Verifying OTP...');
        try {
            const res = await fetch(`${API_BASE_URL}/auth/verify-otp-for-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                setResetToken(data.resetToken);
                setStep(3);
                toast.success('OTP Verified successfully!', { id: toastId });
            } else {
                toast.error(data.message || 'Invalid OTP', { id: toastId });
            }
        } catch (err) {
            toast.error('Verification failed. Try again.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Updating password...');
        try {
            const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetToken, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Password reset successfully! Redirecting...', { id: toastId });
                setTimeout(() => {
                    router.push('/signin');
                }, 2000);
            } else {
                toast.error(data.message || 'Failed to reset password', { id: toastId });
            }
        } catch (err) {
            toast.error('Failed to update password. Try again.', { id: toastId });
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
                        src="/assets/forgot_password_illustration.png"
                        alt="Security Illustration"
                        className="w-full h-auto drop-shadow-2xl animate-fade-in"
                    />
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 overflow-y-auto text-gray-900">
                <div className="max-w-md w-full py-8">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-primary-900 mb-2 tracking-tight">
                            {step === 1 ? 'Forgot Password?' : step === 2 ? 'Verify OTP' : 'Set New Password'}
                        </h2>
                        <p className="text-gray-500 font-medium tracking-tight">
                            {step === 1 && "No worries! Enter your email and we'll send you an OTP code."}
                            {step === 2 && `We've sent a 6-digit code to ${email}`}
                            {step === 3 && "Protect your account with a strong new password."}
                        </p>
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-primary-500"
                                />
                            </div>
                            <Button
                                variant="primary"
                                className="w-full py-4 text-sm rounded-xl font-bold flex items-center justify-center gap-2 group transition-all"
                                disabled={loading}
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                                {!loading && <span className="transform group-hover:translate-x-1 transition-transform">→</span>}
                            </Button>
                            <div className="text-center">
                                <Link href="/signin" className="text-sm font-bold text-accent-600 hover:underline">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleOtpVerify} className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-bold text-gray-400 block text-center uppercase tracking-[0.2em]">Enter 6-digit Code</Label>
                                <div className="flex justify-between gap-2 max-w-[300px] mx-auto">
                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={otp[index] || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val) {
                                                    const newOtp = otp.split('');
                                                    while (newOtp.length < 6) newOtp.push('');
                                                    newOtp[index] = val;
                                                    const combined = newOtp.join('').slice(0, 6);
                                                    setOtp(combined);
                                                    if (index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
                                                } else if (otp[index]) {
                                                    const newOtp = otp.split('');
                                                    newOtp[index] = '';
                                                    setOtp(newOtp.join(''));
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                                    const newOtp = otp.split('');
                                                    newOtp[index - 1] = '';
                                                    setOtp(newOtp.join(''));
                                                    document.getElementById(`otp-${index - 1}`)?.focus();
                                                }
                                            }}
                                            className="w-10 h-12 text-center text-lg font-bold border-2 border-gray-100 rounded-xl bg-gray-50/50 focus:border-accent-600 focus:bg-white focus:ring-4 focus:ring-accent-500/10 transition-all outline-none"
                                        />
                                    ))}
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                className="w-full py-4 text-sm rounded-xl font-bold"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                            <div className="text-center pt-2">
                                {resendTimer > 0 ? (
                                    <p className="text-xs text-gray-400 font-medium">Resend code in <span className="text-primary-900 font-bold">{resendTimer}s</span></p>
                                ) : (
                                    <button type="button" onClick={handleEmailSubmit} className="text-xs font-bold text-accent-600 hover:underline">Resend OTP</button>
                                )}
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-gray-400">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="rounded-xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-primary-500 pr-12"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-gray-400">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="rounded-xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-primary-500"
                                    />
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                className="w-full py-4 text-sm rounded-xl font-bold"
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
