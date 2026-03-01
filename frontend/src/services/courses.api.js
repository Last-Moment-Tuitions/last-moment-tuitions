import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
