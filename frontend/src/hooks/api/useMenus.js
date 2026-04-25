'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/services/menuService';

// Query Keys
export const menuKeys = {
    all: ['menus'],
    list: () => [...menuKeys.all, 'list'],
    detail: (id) => [...menuKeys.all, 'detail', id],
    name: (name) => [...menuKeys.all, 'name', name],
    active: () => [...menuKeys.all, 'active'],
};

// --- Queries ---

export function useMenus() {
    return useQuery({
        queryKey: menuKeys.list(),
        queryFn: () => menuService.getAll(),
    });
}

export function useActiveMenu(initialData) {
    return useQuery({
        queryKey: menuKeys.active(),
        queryFn: () => menuService.getActive(),
        initialData,
    });
}

export function useMenu(id) {
    return useQuery({
        queryKey: menuKeys.detail(id),
        queryFn: () => menuService.getById(id),
        enabled: !!id,
    });
}

// --- Mutations ---

export function useCreateMenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => menuService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: menuKeys.all });
        },
    });
}

export function useUpdateMenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => menuService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: menuKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: menuKeys.all });
        },
    });
}

export function useDeleteMenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => menuService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: menuKeys.all });
        },
    });
}

export function useActivateMenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => menuService.activate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: menuKeys.all });
        },
    });
}
