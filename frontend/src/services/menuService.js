import axios from 'axios';
import API_BASE_URL from '@/lib/config';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const menuService = {
    getAll: async () => {
        const response = await api.get('/menus');
        return response.data.data;
    },

    getByName: async (name) => {
        const response = await api.get(`/menus/name/${name}`);
        return response.data.data;
    },

    getById: async (id) => {
        const response = await api.get(`/menus/${id}`);
        return response.data.data;
    },

    create: async (data) => {
        const response = await api.post('/menus', data);
        return response.data.data;
    },

    update: async (id, data) => {
        const response = await api.patch(`/menus/${id}`, data);
        return response.data.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/menus/${id}`);
        return response.data.data;
    },

    activate: async (id) => {
        const response = await api.patch(`/menus/${id}/activate`);
        return response.data.data;
    },

    getActive: async () => {
        const response = await api.get('/menus/status/active');
        return response.data.data;
    }
};

export default menuService;
