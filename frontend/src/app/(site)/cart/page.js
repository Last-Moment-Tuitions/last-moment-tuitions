'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Star, ArrowRight, ShoppingBag, Trash2, Heart } from 'lucide-react';
import { Button, Input, Breadcrumb } from '@/components/ui';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { cartItems, removeFromCart } = useCart();
    const [coupon, setCoupon] = useState('');

    // Calculate totals only from real cart items
    const subtotal = cartItems.length > 0
        ? cartItems.reduce((acc, item) => acc + (item.price || 0), 0)
        : 0;

    const discountPercent = 8;
    const taxes = cartItems.length > 0 ? 17.99 : 0;
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount + taxes;

    return (
        <div className="bg-white font-sans text-gray-900 pb-10">
            <main className="container mx-auto px-4 mt-12">
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 animate-fade-in-up">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="text-gray-200" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added any courses yet. Go back to our courses to find something new.</p>
                        <Button href="/courses" variant="primary" className="px-10 h-14 bg-[#032e66] hover:bg-[#021f45] border-none rounded-none shadow-md">
                            Browse Courses
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* --- Left Column: Compact Cart Items (75%) --- */}
                        <div className="lg:w-[75%]">
                            <h2 className="text-xl font-bold text-gray-900 mb-5">
                                Shopping Cart <span className="text-gray-400 font-normal ml-1">({cartItems.length})</span>
                            </h2>

                            <div className="bg-white border border-gray-100 rounded-none shadow-sm overflow-hidden">
                                {/* Table Header - Desktop Only */}
                                <div className="hidden md:grid grid-cols-[3fr_1fr_1fr] gap-0 bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <div className="p-4 md:px-6">COURSE</div>
                                    <div className="p-4 md:px-6 text-left">PRICES</div>
                                    <div className="p-4 md:px-6 text-left">ACTION</div>
                                </div>

                                {/* Compact Cart Rows */}
                                <div className="divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex flex-col md:grid md:grid-cols-[3fr_1fr_1fr] md:items-center hover:bg-gray-50/20 transition-all border-b border-gray-100 last:border-0">

                                            {/* Course Details (Main Card Top on Mobile, 60% on Desktop) */}
                                            <div className="p-4 md:px-6 md:py-6 flex items-start md:items-center gap-4 md:gap-5">
                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all shrink-0 mt-1 md:mt-0"
                                                    title="Remove Item"
                                                >
                                                    <X size={10} />
                                                </button>

                                                {/* Image */}
                                                <div className="w-[80px] sm:w-[100px] md:w-[124px] h-[52px] sm:h-[64px] md:h-[80px] rounded-none overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 shadow-sm">
                                                    <img
                                                        src={item.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop"}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop";
                                                        }}
                                                    />
                                                </div>

                                                {/* Text Content */}
                                                <div className="flex-1 min-w-0 flex flex-col gap-1.5 md:gap-2">
                                                    <div className="flex items-center gap-1.5 text-[10px] md:text-[11px]">
                                                        <Star className="text-[#032e66] fill-[#032e66]" size={10} />
                                                        <span className="font-bold text-gray-900">{item.rating || '4.7'}</span>
                                                        <span className="text-gray-400 hidden sm:inline">({item.ratingCount?.toLocaleString() || '451,444'} Review)</span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm md:text-[15px] leading-snug md:leading-relaxed line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-[9px] md:text-xs text-gray-400/80">
                                                        Course by: <span className="text-gray-600 font-medium ml-1">
                                                            {typeof item.instructor === 'object' ? item.instructor.name : item.instructor}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Combined Bottom Area for Mobile (Split into slots md:grid) */}
                                            <div className="flex md:contents border-t border-gray-100 md:border-0">
                                                {/* Price Section */}
                                                <div className="flex-1 p-4 md:px-6 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-center md:justify-start bg-gray-50/30 md:bg-transparent border-r md:border-r-0 border-gray-100">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest md:hidden mb-1.5">Price Tag</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm sm:text-base md:text-lg font-bold text-[#032e66]">₹{(item.price || 0).toFixed(2)}</span>
                                                        {item.originalPrice && (
                                                            <span className="text-[10px] sm:text-xs md:text-sm text-gray-400 line-through font-medium">₹{item.originalPrice.toFixed(2)}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Section */}
                                                <div className="flex-1 p-4 md:px-6 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-center md:justify-start">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest md:hidden mb-1.5">Quick Action</span>
                                                    <button className="text-[11px] sm:text-xs md:text-sm font-bold text-[#032e66] hover:underline underline-offset-4 transition-all">
                                                        Move To Wishlist
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* --- Right Column: Summary Section (25%) --- */}
                        <aside className="lg:w-[25%] space-y-0">
                            <div className="space-y-4">
                                <div className="space-y-2 pb-4">
                                    <div className="flex justify-between items-center text-gray-500">
                                        <span className="text-xs">Subtotal</span>
                                        <span className="text-sm font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500">
                                        <span className="text-xs">Coupon Discount</span>
                                        <span className="text-sm font-semibold text-gray-900">-{discountPercent}%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500">
                                        <span className="text-xs">Taxes</span>
                                        <span className="text-sm font-semibold text-gray-900">₹{taxes.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t border-gray-100 pt-3 pb-4">
                                    <span className="text-xs font-normal text-gray-600">Total:</span>
                                    <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                                        ₹{total.toFixed(2)}
                                    </span>
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full h-11 text-sm font-bold flex items-center justify-center gap-2 bg-[#032e66] hover:bg-[#021f45] border-none rounded-none shadow-none transition-all"
                                >
                                    Proceed To Checkout
                                    <ArrowRight size={18} />
                                </Button>
                            </div>

                            {/* Separator Line */}
                            <div className="border-t border-gray-100 my-8"></div>

                            {/* Coupon Logic - Integrated Style with Zero Radius */}
                            <div className="">
                                <h4 className="text-[11px] uppercase font-bold text-gray-400 mb-3 tracking-widest">Apply coupon code</h4>
                                <div className="flex border border-gray-200 h-11 p-1 bg-white">
                                    <input
                                        type="text"
                                        placeholder="Coupon code"
                                        className="flex-1 px-3 text-xs border-none text-gray-500 focus:ring-0 outline-none"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                    />
                                    <button className="px-6 h-full text-[10px] font-bold bg-[#1D2026] text-white hover:bg-black transition-all uppercase tracking-widest shrink-0">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </aside>

                    </div>
                )}
            </main>
        </div>
    );
}
