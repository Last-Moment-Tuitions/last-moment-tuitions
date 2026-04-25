'use client';

import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/services/courses.api';

// Query Keys
export const courseKeys = {
    all: ['courses'],
    lists: () => [...courseKeys.all, 'list'],
    list: (params) => [...courseKeys.lists(), { params }],
    listInfinite: (params) => [...courseKeys.lists(), 'infinite', { params }],
    details: () => [...courseKeys.all, 'detail'],
    detail: (id) => [...courseKeys.details(), id],
    content: (id) => [...courseKeys.detail(id), 'content'],
};

// --- Queries ---

export function useCourses(params = {}) {
    return useQuery({
        queryKey: courseKeys.list(params),
        queryFn: () => coursesApi.getAllCourses(params),
    });
}

export function useInfiniteCourses(params = {}, limit = 10) {
    return useInfiniteQuery({
        queryKey: courseKeys.listInfinite(params),
        queryFn: ({ pageParam = 1 }) => coursesApi.getAllCourses({ ...params, page: pageParam, limit }),
        getNextPageParam: (lastPage, allPages) => {
            const lastPageItems = lastPage.data || lastPage || [];
            if (lastPageItems.length < limit) return undefined;
            return allPages.length + 1;
        },
        initialPageParam: 1,
    });
}

export function useCourse(id) {
    return useQuery({
        queryKey: courseKeys.detail(id),
        queryFn: () => coursesApi.getCourse(id),
        enabled: !!id,
    });
}

export function useCourseWithContent(id) {
    return useQuery({
        queryKey: courseKeys.content(id),
        queryFn: () => coursesApi.getCourseWithContent(id),
        enabled: !!id,
    });
}

// --- Mutations ---

export function useCreateCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => coursesApi.createCourse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
        },
    });
}

export function useUpdateCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => coursesApi.updateCourse(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
        },
    });
}

export function useUpdateCourseContent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, content }) => coursesApi.updateCourseContent(id, content),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.content(variables.id) });
        },
    });
}

export function usePublishCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => coursesApi.publishCourse(id),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables) });
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
        },
    });
}

export function useDeleteCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => coursesApi.deleteCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
        },
    });
}
