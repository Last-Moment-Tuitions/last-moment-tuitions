"use client";

import { createContext, useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useLogout } from '@/hooks/api/useAuth';
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    // Use TanStack Query for session management
    const { 
        data: user, 
        isLoading: loading, 
        refetch: checkUser 
    } = useUser();

    // Sync user state with localStorage (v5 handles onSuccess via useEffect)
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else if (user === null) {
            localStorage.removeItem('user');
        }
    }, [user]);

    const logoutMutation = useLogout();

    const login = (userData) => {
        // Manually update the query cache with the new user data
        queryClient.setQueryData(['auth', 'me'], userData);
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/');
    };

    const logout = async (onLogout) => {
        if (onLogout && typeof onLogout === 'function') {
            onLogout();
        }

        try {
            await logoutMutation.mutateAsync();
        } catch (error) {
            console.error('Logout failed', error);
        }
        
        localStorage.removeItem('user');
        // Clear session cookie client-side as fallback
        document.cookie = 'sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        setTimeout(() => {
            router.push('/signin');
        }, 500);
    };

    const value = useMemo(() => ({
        user,
        loading,
        checkUser,
        login,
        logout
    }), [user, loading, checkUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
