"use client";

import Link from 'next/link';
import { Mail, KeyRound, ArrowLeft, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button, Input, Label } from '@/components/ui';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
    const { login } = useAuth();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Countdown Timer Logic
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="mb-10">
                    <Link href="/signin" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-primary-600 transition-all mb-8 group">
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Sign In
                    </Link>

                    <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
                        {step === 1 ? 'Forgot Password?' : step === 2 ? 'Enter OTP' : 'Set New Password'}
                    </h2>
                    <div className="text-gray-500 text-sm md:text-base leading-relaxed">
                        {step === 1 && "No worries! Enter your email and we'll send you an OTP code to your inbox."}
                        {step === 2 && (
                            <p>
                                We&apos;ve sent a 6-digit code to <br />
                                <span className="text-gray-900 font-semibold">{email}</span>
                            </p>
                        )}
                        {step === 3 && "Protect your account with a strong new password."}
                    </div>
                </div>

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                icon={<Mail className="h-5 w-5 text-gray-400" />}
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl transition-all"
                            />
                        </div>
                        <Button
                            className="w-full h-12 text-base font-bold shadow-lg shadow-gray-900/10 transition-all hover:scale-[1.01] bg-[#00224D] hover:bg-[#001a3d] rounded-xl"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                            {loading ? 'Sending...' : 'Send OTP'}
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleOtpVerify} className="space-y-6">
                        <div className="space-y-4">
                            <Label htmlFor="otp-0" className="text-[10px] font-bold text-gray-400 block text-center uppercase tracking-[0.2em]">
                                Security Code
                            </Label>
                            <div className="flex justify-between gap-2 max-w-[280px] mx-auto">
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

                                                // Focus next
                                                if (index < 5) {
                                                    document.getElementById(`otp-${index + 1}`)?.focus();
                                                }
                                            } else if (otp[index]) {
                                                const newOtp = otp.split('');
                                                newOtp[index] = '';
                                                setOtp(newOtp.join(''));
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                                // Focus previous
                                                const newOtp = otp.split('');
                                                newOtp[index - 1] = '';
                                                setOtp(newOtp.join(''));
                                                document.getElementById(`otp-${index - 1}`)?.focus();
                                            }
                                        }}
                                        className="w-10 h-12 text-center text-lg font-bold border-2 border-gray-100 rounded-xl bg-gray-50/50 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                                    />
                                ))}
                            </div>
                        </div>

                        <Button
                            className="w-full h-11 text-sm font-bold shadow-lg shadow-primary-900/15 transition-all hover:scale-[1.01] bg-[#00224D] hover:bg-[#001a3d] rounded-xl"
                            disabled={loading || otp.length !== 6}
                        >
                            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                        <div className="text-center pt-2">
                            {resendTimer > 0 ? (
                                <p className="text-sm text-gray-400 font-medium tracking-wide">
                                    Resend code in <span className="font-bold text-[#00224D] underline cursor-default">{resendTimer}s</span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleEmailSubmit}
                                    className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline transition-all"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        icon={<Lock className="h-5 w-5 text-gray-400" />}
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    icon={<Lock className="h-5 w-5 text-gray-400" />}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 text-base font-bold shadow-lg shadow-gray-900/20 transition-all hover:scale-[1.01] bg-[#00224D] hover:bg-[#001a3d] rounded-xl"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
