'use client';

import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { testimonialService } from '@/services/testimonialService';

// Query Keys
export const testimonialKeys = {
    all: ['testimonials'],
    list: (pageTag) => [...testimonialKeys.all, 'list', { pageTag }],
    listInfinite: (params) => [...testimonialKeys.all, 'list', 'infinite', { params }],
    detail: (id) => [...testimonialKeys.all, 'detail', id],
};

// --- Queries ---

export function useTestimonials(pageTag = 'all') {
    return useQuery({
        queryKey: testimonialKeys.list(pageTag),
        queryFn: () => testimonialService.getByPage(pageTag),
    });
}

export function useInfiniteTestimonials(params = {}, limit = 20) {
    return useInfiniteQuery({
        queryKey: testimonialKeys.listInfinite(params),
        queryFn: ({ pageParam = 1 }) => testimonialService.getOne('all', { ...params, page: pageParam, limit }),
        getNextPageParam: (lastPage, allPages) => {
            const lastPageItems = lastPage.details || lastPage.data || lastPage || [];
            if (lastPageItems.length < limit) return undefined;
            return allPages.length + 1;
        },
        initialPageParam: 1,
    });
}

// --- Mutations ---

export function useCreateTestimonial() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => testimonialService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
        },
    });
}

export function useUpdateTestimonial() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => testimonialService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: testimonialKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
        },
    });
}

export function useDeleteTestimonial() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => testimonialService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
        },
    });
}
