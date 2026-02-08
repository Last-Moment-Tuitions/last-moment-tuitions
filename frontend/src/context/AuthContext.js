"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API_BASE_URL from '@/lib/config';

const AuthContext = createContext();

export function AuthProvider({ children, initialUser = null }) {
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(!initialUser);
    const router = useRouter();

    useEffect(() => {
        if (!initialUser) {
            checkUser();
        }
    }, [initialUser]);

    const getSessionId = () => {
        return document.cookie.split('; ').find(row => row.startsWith('sessionId='))?.split('=')[1];
    };

    const checkUser = async () => {
        try {
            const sessionId = getSessionId();
            const headers = sessionId ? { 'x-session-id': sessionId } : {};

            const res = await fetch(`${API_BASE_URL}/auth/me`, { headers });
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
            await fetch(`${API_BASE_URL}/auth/logout`, {
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
