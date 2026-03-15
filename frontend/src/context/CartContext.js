"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import cartApi from '@/services/cart.api';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const { toast } = useToast();
    const user = useAuth()?.user;

    const transformServerCart = useCallback((serverCart) => {
        const items = serverCart?.data?.items || serverCart?.items || [];
        return items.map(item => {
            const course = item.course_id;
            if (!course) return null;
            return {
                id: course._id || course.id,
                title: course.title,
                price: (course.price || 0) / 100,
                originalPrice: (course.original_price || 0) / 100,
                image: course.thumbnail || course.image,
                // Instructor Fallback Fix
                instructor: course.instructor?.name || course.instructor || 'LMT Instructor',
                rating: course.average_rating || 4.8,
                category: course.category
            };
        }).filter(Boolean);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const syncAndFetch = async () => {
            const sessionId = localStorage.getItem('sessionId') || document.cookie.includes('sessionId=');
            
            if (user && sessionId) {
                setIsSyncing(true);
                try {
                    // 1. Sync guest items
                    const localCart = localStorage.getItem('cart');
                    if (localCart) {
                        const localItems = JSON.parse(localCart);
                        if (localItems?.length > 0) {
                            const ids = localItems.map(i => i.id).filter(Boolean);
                            await cartApi.syncCart(ids);
                            localStorage.removeItem('cart');
                        }
                    }
                    
                    // 2. Fetch server cart
                    const response = await cartApi.getCart();
                    if (isMounted) {
                        setCartItems(transformServerCart(response));
                    }
                } catch (error) {
                    console.error("Cart sync error:", error);
                } finally {
                    if (isMounted) setIsSyncing(false);
                }
            } else if (!user) {
                const stored = localStorage.getItem('cart');
                if (stored && isMounted) {
                    try { setCartItems(JSON.parse(stored)); } catch (e) { setCartItems([]); }
                } else if (isMounted) {
                    setCartItems([]);
                }
            }
        };

        syncAndFetch();
        return () => { isMounted = false; };
    }, [user, transformServerCart]);

    const addToCart = async (course) => {
        if (cartItems.find(item => item.id === course.id)) {
            toast.error("Already in cart");
            return;
        }

        if (user) {
            try { await cartApi.addItem(course.id); } catch (e) {}
        } else {
            const newCart = [...cartItems, course];
            localStorage.setItem('cart', JSON.stringify(newCart));
        }
        setCartItems(prev => [...prev, course]);
        toast.success("Added to cart");
    };

    const removeFromCart = async (courseId) => {
        if (user) {
            try { await cartApi.removeItem(courseId); } catch (e) {}
        }
        const newItems = cartItems.filter(item => item.id !== courseId);
        setCartItems(newItems);
        if (!user) localStorage.setItem('cart', JSON.stringify(newItems));
        toast.success("Removed");
    };

    const clearCart = async () => {
        if (user) {
            try { await cartApi.clearCart(); } catch (e) {}
        }
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, isSyncing }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
