import axios from 'axios';
import API_BASE_URL from '@/lib/config';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const contentService = {
    getNav: async () => {
        const response = await api.get('/pages/nav');
        return response.data;
    },

    getPage: async (slug) => {
        const response = await api.get(`/pages/slug/${slug}`);
        return response.data;
    }
};

export default contentService;
