"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const { toast } = useToast();

    // Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart from localStorage", e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (course) => {
        const exists = cartItems.find(item => item.id === course.id);
        if (exists) {
            toast.error("Course is already in your cart");
            return;
        }
        setCartItems(prev => [...prev, course]);
        toast.success("Successfully added to cart");
    };

    const removeFromCart = (courseId) => {
        setCartItems(prev => prev.filter(item => item.id !== courseId));
        toast.success("Removed from cart");
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
