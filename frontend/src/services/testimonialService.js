import axios from 'axios';
import API_BASE_URL from '@/lib/config';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };
    
    // AuthContext manages this, but adding it for robustness
    const sessionId = getCookie('sessionId');
    if (sessionId) {
        config.headers['X-Session-Id'] = sessionId;
    }
    
    // In case the frontend passes token in localstorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => {
        if (response.data && response.data.success && response.data.details !== undefined) {
            response.data = response.data.details;
        }
        return response;
    },
    (error) => Promise.reject(error)
);

export const testimonialService = {
    getByPage: async (pageTag) => {
        try {
            const response = await api.get('/testimonials', {
                params: { target_page: pageTag }
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error("Critical Fetch Error:", error);
            throw error;
        }
    },

    create: async (data) => {
        try {
            const response = await api.post('/testimonials', data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create testimonial');
        }
    },

    update: async (id, data) => {
        try {
            const response = await api.patch(`/testimonials/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update testimonial');
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/testimonials/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete testimonial');
        }
    }
};