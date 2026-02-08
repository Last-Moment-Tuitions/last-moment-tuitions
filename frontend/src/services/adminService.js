import axios from 'axios';
import API_BASE_URL from '@/lib/config';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for session cookies
});

// Add request interceptor to inject x-session-id
api.interceptors.request.use((config) => {
    // Try to get sessionId from cookie as fallback/explicit check
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    // AuthContext usually manages this, but for robustness as requested:
    const sessionId = getCookie('sessionId');
    if (sessionId) {
        config.headers['x-session-id'] = sessionId;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Admin Service Object
export const adminService = {
    // Pages
    getPages: async (params = {}) => {
        const response = await api.get('/pages', { params });
        return response.data;
    },

    getPage: async (id) => {
        const response = await api.get(`/admin/pages/id/${id}`);
        return response.data;
    },

    getPageBySlug: async (slug) => {
        const response = await api.get(`/admin/pages/slug/${slug}`);
        return response.data;
    },

    createPage: async (data) => {
        const response = await api.post('/admin/pages', data);
        return response.data;
    },

    updatePage: async (id, data) => {
        const response = await api.put(`/admin/pages/${id}`, data);
        return response.data;
    },

    deletePage: async (id) => {
        const response = await api.delete(`/admin/pages/${id}`);
        return response.data;
    },

    incrementView: async (id) => {
        const response = await api.post(`/admin/pages/${id}/view`);
        return response.data;
    },

    // Folders
    getFolders: async (params = {}) => {
        const response = await api.get('/admin/folders', { params });
        return response.data;
    },

    createFolder: async (data) => {
        const response = await api.post('/admin/folders', data);
        return response.data;
    },

    deleteFolder: async (id) => {
        const response = await api.delete(`/admin/folders/${id}`);
        return response.data;
    }
};

export default adminService;
