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
        // Always check user on mount for client-side verification
        checkUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getSessionId = () => {
        return document.cookie.split('; ').find(row => row.startsWith('sessionId='))?.split('=')[1];
    };

    const checkUser = async () => {
        try {
            // First, try to load user from localStorage for instant UI update
            const storedUser = localStorage.getItem('user');
            console.log('[AuthContext] localStorage user:', storedUser);
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                console.log('[AuthContext] Parsed user:', parsedUser);
                setUser(parsedUser);
            }

            // Then verify session with API call
            const sessionId = getSessionId();
            const headers = sessionId ? { 'x-session-id': sessionId } : {};

            const res = await fetch(`${API_BASE_URL}/auth/me`, { headers });

            if (res.ok) {
                const responseData = await res.json();

                // Check if response has nested details structure like login endpoint
                const userData = responseData.details || responseData;

                // Validate user data has required fields
                if (userData && userData._id) {
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } else {
                    setUser(null);
                    localStorage.removeItem('user');
                }
            } else {
                setUser(null);
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Session check failed', error);
            setUser(null);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/');
    };

    const logout = async (onLogout) => {
        // Call the optional callback before logout (for toast notifications)
        if (onLogout && typeof onLogout === 'function') {
            onLogout();
        }

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
        localStorage.removeItem('user');
        // Clear cookie if not HttpOnly (backend clears it usually, but we can try)
        document.cookie = 'sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        // Small delay to allow toast to be visible before redirect
        setTimeout(() => {
            router.push('/signin');
        }, 500);
    };

    return (
        <AuthContext.Provider value={{ user, loading, checkUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
