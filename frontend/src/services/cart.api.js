import api from './courses.api'; // Reusing the axios instance with interceptors

export const cartApi = {
    // Get user's cart from server
    getCart: () => {
        return api.get('/cart');
    },

    // Add item to server cart
    addItem: (courseId) => {
        return api.post('/cart/add', { course_id: courseId });
    },

    // Remove item from server cart
    removeItem: (courseId) => {
        return api.delete(`/cart/remove/${courseId}`);
    },

    // Sync guest cart to server
    syncCart: (courseIds) => {
        return api.post('/cart/sync', { course_ids: courseIds });
    },

    // Clear server cart
    clearCart: () => {
        return api.post('/cart/clear');
    }
};

export default cartApi;
