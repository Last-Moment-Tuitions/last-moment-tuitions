'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Calendar, User, Mail, Phone, CreditCard, ChevronRight, Download } from 'lucide-react';

export default function OrderConfirmationPage() {
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Read order details from sessionStorage
        const storedOrderStr = sessionStorage.getItem('lastOrder');
        if (storedOrderStr) {
            try {
                const parsedData = JSON.parse(storedOrderStr);
                // Handle wrapped response from TransformInterceptor (details)
                const orderData = parsedData.details || parsedData.data || parsedData;
                setOrder(orderData);
            } catch (error) {
                console.error('Failed to parse order from session:', error);
            }
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="text-gray-400 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-500 mb-6">We couldn't find your recent order details. It may have expired from your current session.</p>
                    <Link href="/courses">
                        <button className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors">
                            Browse Courses
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Success Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="text-green-500 w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Order Successful!</h1>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                        Thank you for your purchase. We've sent a confirmation email to <span className="font-semibold text-gray-900">{order.email}</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                    {/* Left Column - Customer Details */}
                    <div className="md:col-span-7 space-y-6">
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                                Customer Details
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500 flex items-center gap-2"><User size={16} /> Name</div>
                                    <div className="font-medium text-gray-900">{order.user_name}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500 flex items-center gap-2"><Mail size={16} /> Email</div>
                                    <div className="font-medium text-gray-900">{order.email}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500 flex items-center gap-2"><Phone size={16} /> Phone</div>
                                    <div className="font-medium text-gray-900">{order.phone}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500 flex items-center gap-2"><CreditCard size={16} /> Payment Status</div>
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 capitalize">
                                        {order.status?.replace('_', ' ') || 'Pending'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {/* <Link href={`/courses/${order.course_id}/learn`} className="flex-1"> */}
                            <Link href={`/profile`} className="flex-1">
                                <button className="w-full py-4 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                    Start Learning <ChevronRight size={20} />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="md:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                            Order Summary
                        </h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-start">
                                <div className="text-sm text-gray-500">Order ID</div>
                                <div className="font-mono text-sm font-medium bg-gray-50 px-2 py-1 rounded border border-gray-200 text-gray-800">
                                    {order.order_id}
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div className="text-sm text-gray-500">Date</div>
                                <div className="text-sm font-medium text-gray-900">
                                    {new Date(order.created_at || Date.now()).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div className="text-sm text-gray-500 max-w-[60%]">Course</div>
                                <div className="text-sm font-medium text-gray-900 text-right">{order.course_title}</div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-dashed border-gray-200">
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Subtotal</span>
                                <span>₹{order.price}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600 text-sm">
                                    <span>Discount</span>
                                    <span>-₹{order.discount?.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-3 border-t border-gray-100 mt-2">
                                <span>Total Paid</span>
                                <span className="text-primary-600 text-2xl">₹{order.final_amount?.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <button className="inline-flex items-center justify-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                                <Download size={18} /> Download Invoice
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
