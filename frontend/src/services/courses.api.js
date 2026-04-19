import axios from 'axios';
import API_BASE_URL from '@/lib/config';
import { getCookie } from '@/utils/cookie';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for session cookies
});

// Request interceptor for adding auth token (using sessionId cookie)
api.interceptors.request.use(
    (config) => {
        const sessionId = getCookie('sessionId');
        if (sessionId) {
            config.headers['x-session-id'] = sessionId;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        // If the API somehow returns HTML instead of JSON, reject it
        if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
            console.error('API returned HTML instead of JSON');
            return Promise.reject(new Error('API returned invalid data format'));
        }

        // Unwrap the { success, message, details } wrapper if it exists
        if (response.data && response.data.success && response.data.details !== undefined) {
            return response.data; // Note: We return the whole data object here because many callers expect {success, data, total}
        }

        return response.data;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const coursesApi = {
    // Get all courses with optional filters
    getAllCourses: (params = {}) => {
        return api.get('/courses', { params });
    },

    // Get single course by ID
    getCourse: (id) => {
        return api.get(`/courses/${id}`);
    },

    // Get course with full curriculum
    getCourseWithContent: (id) => {
        return api.get(`/courses/${id}/full`);
    },

    // Generate secure hand-shake ticket
    getSecureDocumentTicket: (courseId, lectureId) => {
        return api.post(`/courses/${courseId}/lecture/${lectureId}/secure-ticket`);
    },

    // Fetch secure document stream for Canvas
    getSecureDocumentStream: (courseId, lectureId, ticket, timestamp) => {
        return api.get(`/courses/${courseId}/lecture/${lectureId}/secure-document`, {
            params: { ticket, t: timestamp },
            responseType: 'blob'
        });
    },

    // Create new course
    createCourse: (data) => {
        return api.post('/courses', data);
    },

    // Update course metadata
    updateCourse: (id, data) => {
        return api.patch(`/courses/${id}`, data);
    },

    // Update course curriculum
    updateCourseContent: (id, content) => {
        return api.patch(`/courses/${id}/content`, { content });
    },

    // Publish course
    publishCourse: (id) => {
        return api.patch(`/courses/${id}/publish`);
    },

    // Delete course
    deleteCourse: (id) => {
        return api.delete(`/courses/${id}`);
    },

    // Increment view count
    incrementViews: (id) => {
        return api.post(`/courses/${id}/view`);
    },
};

export default api;
