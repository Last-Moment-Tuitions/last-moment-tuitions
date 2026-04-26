import axios from 'axios';
import API_BASE_URL from '@/lib/config';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Helper to get session ID from cookies
const getSessionId = () => {
    if (typeof document === 'undefined') return null;
    return document.cookie.split('; ').find(row => row.startsWith('sessionId='))?.split('=')[1];
};

// Add interceptor to include session ID header
api.interceptors.request.use((config) => {
    const sessionId = getSessionId();
    if (sessionId) {
        config.headers['x-session-id'] = sessionId;
    }
    return config;
});

export const authService = {
    me: async () => {
        const response = await api.get('/auth/me');
        // Standardize response to return the user data directly
        return response.data.details || response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    }
};

export default authService;
