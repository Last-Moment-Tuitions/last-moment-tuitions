'use client';

import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';

// Query Keys
export const adminKeys = {
    all: ['admin'],
    pages: (params) => [...adminKeys.all, 'pages', { params }],
    pagesInfinite: (params) => [...adminKeys.all, 'pages', 'infinite', { params }],
    page: (id) => [...adminKeys.all, 'page', id],
    pageBySlug: (slug) => [...adminKeys.all, 'page', 'slug', slug],
    folders: (params) => [...adminKeys.all, 'folders', { params }],
    templates: (params) => [...adminKeys.all, 'templates', { params }],
    testimonials: (params) => [...adminKeys.all, 'testimonials', { params }],
    testimonial: (id) => [...adminKeys.all, 'testimonial', id],
};

// --- Queries ---

export function usePages(params = {}) {
    return useQuery({
        queryKey: adminKeys.pages(params),
        queryFn: () => adminService.getPages(params),
    });
}

export function useInfinitePages(params = {}, limit = 20) {
    return useInfiniteQuery({
        queryKey: adminKeys.pagesInfinite(params),
        queryFn: ({ pageParam = 1 }) => adminService.getPages({ ...params, page: pageParam, limit }),
        getNextPageParam: (lastPage, allPages) => {
            // Admin endpoint returns a raw array; public endpoint wraps in { data: [] }
            const lastPageItems = Array.isArray(lastPage) ? lastPage : (lastPage.data || []);
            if (lastPageItems.length < limit) return undefined;
            return allPages.length + 1;
        },
        initialPageParam: 1,
    });
}

export function usePage(id) {
    return useQuery({
        queryKey: adminKeys.page(id),
        queryFn: () => adminService.getPage(id),
        enabled: !!id,
    });
}

export function usePageBySlug(slug) {
    return useQuery({
        queryKey: adminKeys.pageBySlug(slug),
        queryFn: () => adminService.getPageBySlug(slug),
        enabled: !!slug,
    });
}

export function useFolders(params = {}) {
    return useQuery({
        queryKey: adminKeys.folders(params),
        queryFn: () => adminService.getFolders(params),
    });
}

export function useAdminTestimonials(params = {}) {
    return useQuery({
        queryKey: adminKeys.testimonials(params),
        queryFn: () => adminService.getTestimonials(params),
    });
}

// --- Mutations ---

export function useCreatePage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => adminService.createPage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.pages({}) });
        },
    });
}

export function useUpdatePage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => adminService.updatePage(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: adminKeys.page(variables.id) });
            queryClient.invalidateQueries({ queryKey: adminKeys.pages({}) });
        },
    });
}

export function useDeletePage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => adminService.deletePage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.pages({}) });
        },
    });
}

export function useCreateFolder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => adminService.createFolder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.folders({}) });
        },
    });
}

export function useDeleteFolder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => adminService.deleteFolder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminKeys.folders({}) });
        },
    });
}
