import api from './courses.api';

export const wishlistApi = {
    getWishlist: () => {
        return api.get('/wishlist');
    },

    addItem: (courseId) => {
        return api.post('/wishlist/add', { course_id: courseId });
    },

    removeItem: (courseId) => {
        return api.delete(`/wishlist/remove/${courseId}`);
    },

    syncWishlist: (courseIds) => {
        return api.post('/wishlist/sync', { course_ids: courseIds });
    }
};

export default wishlistApi;
