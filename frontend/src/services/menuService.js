import axios from 'axios';
import API_BASE_URL from '@/lib/config';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const menuService = {
    getAll: async () => {
        const response = await api.get('/menus');
        return response.data;
    },

    getByName: async (name) => {
        const response = await api.get(`/menus/name/${name}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/menus/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/menus', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.patch(`/menus/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/menus/${id}`);
        return response.data;
    },

    activate: async (id) => {
        const response = await api.patch(`/menus/${id}/activate`);
        return response.data;
    },

    getActive: async () => {
        const response = await api.get('/menus/status/active');
        return response.data;
    }
};

export default menuService;
