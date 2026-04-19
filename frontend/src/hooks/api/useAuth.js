'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';

// Query Keys
export const authKeys = {
    all: ['auth'],
    me: () => [...authKeys.all, 'me'],
};

// --- Queries ---

export function useUser(options = {}) {
    return useQuery({
        queryKey: authKeys.me(),
        queryFn: () => authService.me(),
        staleTime: 1000 * 60 * 15, // 15 minutes - session doesn't change often
        gcTime: 1000 * 60 * 60, // 1 hour
        retry: 1,
        ...options
    });
}

// --- Mutations ---

export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => authService.logout(),
        onSettled: () => {
            // Clear all queries on logout to prevent data leakage
            queryClient.clear();
            // Redirect or other side effects handled in component
        },
    });
}
