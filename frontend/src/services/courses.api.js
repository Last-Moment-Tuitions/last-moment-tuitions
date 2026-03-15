import axios from 'axios';
import API_BASE_URL from '@/lib/config';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        let sessionId = document.cookie
            .split('; ')
            .find(row => row.startsWith('sessionId='))
            ?.split('=')[1];

        if (!sessionId) {
            sessionId = localStorage.getItem('sessionId');
        }

        if (sessionId) {
            // Fix: Standardized to X-Session-Id
            config.headers['X-Session-Id'] = sessionId;
            config.headers.Authorization = `Bearer ${sessionId}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
            return Promise.reject(new Error('API returned invalid data format'));
        }
        return response.data;
    },
    (error) => {
        if (error.response?.status !== 401) {
            const status = error.response?.status || 'NETWORK_ERROR';
            console.error(`[API Error] ${status}: ${error.message}`);
        }
        return Promise.reject(error);
    }
);

export const coursesApi = {
    getAllCourses: (params = {}) => api.get('/courses', { params }),
    getCourse: (id) => api.get(`/courses/${id}`),
    getCourseWithContent: (id) => api.get(`/courses/${id}/full`),
    createCourse: (data) => api.post('/courses', data),
    updateCourse: (id, data) => api.patch(`/courses/${id}`, data),
    updateCourseContent: (id, content) => api.patch(`/courses/${id}/content`, { content }),
    publishCourse: (id) => api.patch(`/courses/${id}/publish`),
    deleteCourse: (id) => api.delete(`/courses/${id}`),
    incrementViews: (id) => api.post(`/courses/${id}/view`),
    // Methods for Cart mapping
    addItem: (id) => api.post('/cart/add', { course_id: id }),
    removeItem: (id) => api.delete(`/cart/remove/${id}`),
};

export default api;
