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

// Add response interceptor to handle errors and unwrap API response
api.interceptors.response.use(
    (response) => {
        // Unwrap the { success, message, details } wrapper
        if (response.data && response.data.success && response.data.details !== undefined) {
            response.data = response.data.details;
        }
        return response;
    },
    (error) => {
        // Extract error message from backend response
        let errorMessage = 'An unexpected error occurred. Please try again.';

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const { data, status } = error.response;

            // NestJS error format: { statusCode, message, error }
            if (data?.message) {
                errorMessage = Array.isArray(data.message)
                    ? data.message.join(', ')
                    : data.message;
            } else if (data?.error) {
                errorMessage = data.error;
            }

        } else if (error.request) {
            // The request was made but no response was received
            errorMessage = 'No response from server. Please check your connection.';
        } else {
            // Something happened in setting up the request
            errorMessage = error.message || errorMessage;
        }

        // Create a new error with the extracted message
        const enhancedError = new Error(errorMessage);
        enhancedError.originalError = error;
        enhancedError.statusCode = error.response?.status;

        return Promise.reject(enhancedError);
    }
);

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
