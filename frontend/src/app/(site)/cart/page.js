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
            <main className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 animate-fade-in-up">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="text-gray-200" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added any courses yet. Go back to our courses to find something new.</p>
                        <Button href="/courses" variant="primary" className="px-10 h-14 bg-[#153A8D] hover:bg-[#112C6E] border-none rounded-none shadow-md">
                            Browse Courses
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-[32px] items-start">

                        {/* --- Left Column: Compact Cart Items --- */}
                        <div className="flex-1 w-full lg:min-w-0">
                            <h2 className="text-xl font-bold text-gray-900 mb-5">
                                Shopping Cart <span className="text-gray-400 font-normal ml-1">({cartItems.length})</span>
                            </h2>

                            {/* Table */}
                            <div className="flex flex-col justify-start pb-6 bg-[#FFFFFF] border border-[#E9EAF0] w-full overflow-hidden">
                                {/* Table Header - Desktop Only */}
                                <div className="w-full hidden md:grid grid-cols-[3fr_1fr_1fr] gap-0 border-b border-[#E9EAF0] text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <div className="p-4 md:pl-12 md:pr-6">COURSE</div>
                                    <div className="p-4 md:pr-6 text-left">PRICES</div>
                                    <div className="p-4 text-left">ACTION</div>
                                </div>

                                {/* Compact Cart Rows */}
                                <div className="w-full divide-y divide-[#E9EAF0]">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="group hover:bg-gray-50/20 transition-all border-b border-gray-100 last:border-0">
                                            {/* Unified Item Wrapper: Vertical on Mobile, Row on Desktop */}
                                            <div className="flex flex-col md:grid md:grid-cols-[3fr_1fr_1fr] md:items-center p-4 md:p-0 min-h-[120px]">

                                                {/* Section 1: Image & Basic Info */}
                                                <div className="flex flex-col md:flex-row gap-4 md:gap-5 md:pl-12 md:pr-6 md:h-full md:items-center relative">

                                                    {/* Image Container with Overlay Delete (Mobile) / Side Delete (Desktop) */}
                                                    <div className="relative w-full md:w-[124px] h-auto md:h-[80px] shrink-0">
                                                        {/* Mobile Delete Option (On top of photo) */}
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="absolute top-2 left-2 z-10 w-7 h-7 flex md:hidden items-center justify-center rounded-full bg-white shadow-md text-gray-500 hover:text-red-500 transition-all"
                                                        >
                                                            <X size={14} strokeWidth={2.5} />
                                                        </button>

                                                        {/* Desktop Delete (Beside photo - inside padding) */}
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="hidden md:flex absolute -left-9 top-1/2 -translate-y-1/2 w-6 h-6 items-center justify-center rounded-full border-[1.5px] border-[#8C94A3] text-[#8C94A3] hover:text-gray-900 hover:border-gray-900 transition-all"
                                                        >
                                                            <X size={12} strokeWidth={2} />
                                                        </button>

                                                        <div className="w-full h-full aspect-[16/9] md:aspect-auto md:h-full rounded-lg md:rounded-none overflow-hidden border border-gray-100 bg-gray-50">
                                                            <img
                                                                src={item.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop"}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop";
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Text Details Area */}
                                                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-1.5 text-xs">
                                                            <Star className="text-orange-400 fill-orange-400" size={12} />
                                                            <span className="font-bold text-gray-900">{item.rating || '4.8'}</span>
                                                            <span className="text-gray-500 font-medium ml-1">({(item.ratingCount || 451444).toLocaleString()} Reviews)</span>
                                                        </div>
                                                        <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-[15px] leading-snug line-clamp-2">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-xs sm:text-sm text-[#8C94A3]">
                                                            Course by: <span className="text-gray-600 font-medium ml-1">{item.instructor && typeof item.instructor === 'object' ? item.instructor.name : (item.instructor || 'Unknown')}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Section 2: Price Tag */}
                                                <div className="flex flex-col md:pr-6 md:h-full md:justify-center mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-50">
                                                    <div className="flex items-center justify-between md:justify-start md:gap-2">
                                                        <span className="md:hidden text-xs font-bold text-gray-500 uppercase">Prices</span>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-base md:text-lg font-bold text-[#153A8D]">₹{(item.price || 0).toLocaleString()}</span>
                                                            {item.originalPrice && (
                                                                <span className="text-xs md:text-sm text-gray-400 line-through">₹{item.originalPrice.toLocaleString()}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Section 3: Actions (Wishlist) */}
                                                <div className="flex items-center justify-between md:justify-start md:h-full mt-2 md:mt-0">
                                                    <span className="md:hidden text-xs font-bold text-gray-500 uppercase">Action</span>
                                                    {/* Mobile "Wishlist" button */}
                                                    <button className="flex md:hidden items-center gap-2 px-4 py-2 bg-[#F0F2F5] text-[#153A8D] rounded-lg">
                                                        <Heart size={14} className="stroke-[2.5px]" />
                                                        <span className="text-[11px] font-bold uppercase tracking-wider">Wishlist</span>
                                                    </button>

                                                    {/* Desktop "Move To Wishlist" */}
                                                    <button className="hidden md:block text-sm font-bold text-[#153A8D] py-2.5 whitespace-nowrap hover:bg-[#153A8D]/10 transition-colors uppercase tracking-tight">
                                                        Move To Wishlist
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* --- Right Column: Summary Section --- */}
                        <aside className="w-full lg:w-[350px] xl:w-[400px] flex-none flex flex-col gap-6 order-last lg:order-none">
                            {/* Subtotal, Discount, Taxes Group */}
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center text-gray-500">
                                    <span className="text-sm">Subtotal</span>
                                    <span className="text-sm font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500">
                                    <span className="text-sm">Coupon Discount</span>
                                    <span className="text-sm font-semibold text-gray-900">-{discountPercent}%</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500">
                                    <span className="text-sm">Taxes</span>
                                    <span className="text-sm font-semibold text-gray-900">₹{taxes.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100"></div>

                            {/* Total Area */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-normal text-gray-600">Total:</span>
                                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>

                            <Button
                                variant="primary"
                                className="w-full h-12 text-sm font-bold flex items-center justify-center gap-2 bg-[#153A8D] hover:bg-[#112C6E] border-none rounded-none shadow-none transition-all"
                            >
                                Proceed To Checkout
                                <ArrowRight size={18} />
                            </Button>

                            <div className="border-t border-gray-100"></div>

                            {/* Coupon Logic */}
                            <div className="flex flex-col gap-3">
                                <h4 className="text-[11px] uppercase font-bold text-gray-400 tracking-widest text-left">Apply coupon code</h4>
                                <div className="flex border border-gray-200 h-12 bg-white">
                                    <input
                                        type="text"
                                        placeholder="Coupon code"
                                        className="flex-1 px-4 text-sm border-none text-gray-500 focus:ring-0 outline-none h-full"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                    />
                                    <button className="px-6 h-full text-[11px] font-bold bg-[#1D2026] text-white hover:bg-black transition-all uppercase tracking-widest shrink-0">
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
