'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronRight, ShieldCheck, CreditCard, Lock,
    ArrowLeft, CheckCircle, AlertCircle, Info,
    User, Mail, Phone, Tag
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui.jsx';
import { coursesApi } from '@/services/courses.api';
import { ordersApi } from '@/services/orders.api';

export default function CheckoutPage({ params }) {
    const { id } = use(params);
    const router = useRouter();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        user_name: '',
        email: '',
        phone: ''
    });

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await coursesApi.getCourseWithContent(id);
                setCourse(response?.data || response);
            } catch (err) {
                console.error('Failed to fetch course details:', err);
                setError('Could not load course details. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchCourse();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const applyCoupon = () => {
        setCouponError('');
        if (!couponCode.trim()) return;

        // Mock coupon validation
        if (couponCode.toUpperCase() === 'LMT10' || couponCode.toUpperCase() === 'WELCOME10') {
            setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 0.1 });
        } else if (couponCode.toUpperCase() === 'FREE') {
            setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 1 });
        } else {
            setCouponError('Invalid coupon code');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        try {
            setSubmitting(true);
            setError(null);

            const coursePrice = course.price || 0;
            const discountAmount = appliedCoupon ? coursePrice * appliedCoupon.discount : 0;
            const finalAmount = Math.max(0, coursePrice - discountAmount);

            const orderData = {
                course_id: id,
                course_title: course.title,
                user_name: formData.user_name,
                email: formData.email,
                phone: formData.phone,
                price: coursePrice,
                discount: discountAmount,
                final_amount: finalAmount
            };

            const response = await ordersApi.createOrder(orderData);

            // Store order in session for confirmation page
            sessionStorage.setItem('lastOrder', JSON.stringify(response));

            // Redirect to confirmation
            router.push('/order-confirmation');
        } catch (err) {
            console.error('Order creation failed:', err);
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Preparing your checkout...</p>
                </div>
            </div>
        );
    }

    if (error && !course) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link href="/courses">
                        <Button className="w-full">Back to Courses</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const originalPrice = course.price || 0;
    const discount = appliedCoupon ? originalPrice * appliedCoupon.discount : 0;
    const total = originalPrice - discount;

    return (
        <div className="bg-[#F8FAFC] min-h-screen py-12">
            <div className="container mx-auto px-4 ">

                {/* Header */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <Link href={`/courses/${id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-4 group font-medium text-sm">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Course
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">Checkout</h1>
                    </div>
                    <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                        <ShieldCheck className="text-green-500" size={20} />
                        <span className="text-sm font-semibold text-gray-600">Secure Checkout</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Side: Forms */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. Customer Information */}
                        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-6">
                                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 font-bold">1</div>
                                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                            </div>

                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                                            <User size={14} /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="user_name"
                                            required
                                            value={formData.user_name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your name"
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                                            <Mail size={14} /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="you@example.com"
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 max-w-md">
                                    <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                                        <Phone size={14} /> Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter phone number"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* 2. Payment Method (Mock) */}
                        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-6">
                                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 font-bold">2</div>
                                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 border-2 border-primary-500 bg-primary-50/30 rounded-2xl flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full border-2 border-primary-600 flex items-center justify-center">
                                            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-900">Pay via UPI / Cards / NetBanking</span>
                                            <p className="text-xs text-gray-500 font-medium">Securely process via our payment gateway</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <CreditCard size={24} className="text-gray-400" />
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                                    <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                    <p className="text-xs font-medium text-amber-700 leading-relaxed">
                                        Hey There, We are currently in test mode.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Mobile */}
                        <div className="lg:hidden">
                            <Button
                                type="submit"
                                form="checkout-form"
                                disabled={submitting}
                                className="w-full h-16 text-lg font-bold bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-500/30 transition-all active:scale-95"
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    <>Complete Order <ChevronRight size={20} /></>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Right Side: Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-6">

                            {/* Order Summary */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-[#0F172A] p-6 text-white text-center">
                                    <h3 className="font-bold text-lg">Order Summary</h3>
                                </div>
                                <div className="p-6 md:p-8 space-y-6">

                                    {/* Course Info */}
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                                            <img
                                                src={course.thumbnail || 'https://placehold.co/100'}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="font-bold text-gray-900 leading-snug line-clamp-2">{course.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1 font-medium italic">Lifetime Access</p>
                                        </div>
                                    </div>

                                    <hr className="border-gray-50" />

                                    {/* Coupon */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Have a coupon?</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="Enter code"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary-500 focus:bg-white transition-all"
                                                />
                                            </div>
                                            <button
                                                onClick={applyCoupon}
                                                className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {couponError && <p className="text-xs font-bold text-red-500 ml-1">{couponError}</p>}
                                        {appliedCoupon && (
                                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-100">
                                                <Tag size={12} /> {appliedCoupon.code} Applied!
                                                <button onClick={() => setAppliedCoupon(null)} className="text-green-900 underline ml-2">Remove</button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                        <div className="flex justify-between text-sm text-gray-600 font-medium">
                                            <span>Original Price</span>
                                            <span>₹{originalPrice.toFixed(2)}</span>
                                        </div>
                                        {appliedCoupon && (
                                            <div className="flex justify-between text-sm text-green-600 font-bold">
                                                <span>Coupon Discount</span>
                                                <span>-₹{discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="pt-4 border-t border-gray-200 flex justify-between items-center bg-transparent">
                                            <span className="text-lg font-extrabold text-[#0F172A]">Total Amount</span>
                                            <span className="text-3xl font-black text-primary-600">₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        form="checkout-form"
                                        disabled={submitting}
                                        className="w-full h-16 text-lg font-bold bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>Place Order <ChevronRight size={20} /></>
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                            By completing your purchase you agree to our <br />
                                            <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Security Badges */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-center gap-6">
                                <div className="flex flex-col items-center gap-1">
                                    <Lock size={20} className="text-gray-400" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure SSL</span>
                                </div>
                                <div className="h-8 w-[1px] bg-gray-100"></div>
                                <div className="flex flex-col items-center gap-1">
                                    <ShieldCheck size={20} className="text-gray-400" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
