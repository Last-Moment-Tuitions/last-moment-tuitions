"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    const getSessionId = () => {
        return document.cookie.split('; ').find(row => row.startsWith('sessionId='))?.split('=')[1];
    };

    const checkUser = async () => {
        try {
            const sessionId = getSessionId();
            const headers = sessionId ? { 'x-session-id': sessionId } : {};

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/me`, { headers });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Session check failed', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData) => {
        setUser(userData);
        router.push('/');
    };

    const logout = async () => {
        try {
            const sessionId = getSessionId();
            const headers = sessionId ? { 'x-session-id': sessionId } : {};
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/logout`, {
                method: 'POST',
                headers
            });
        } catch (error) {
            console.error('Logout failed', error);
        }
        setUser(null);
        // Clear cookie if not HttpOnly (backend clears it usually, but we can try)
        document.cookie = 'sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/signin');
    };

    return (
        <AuthContext.Provider value={{ user, loading, checkUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
