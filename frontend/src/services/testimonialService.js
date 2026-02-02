// Ensure this matches your frontend .env variable name
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005';
const baseUrl = `${BACKEND_URL}/api`;

/**
 * Helper to get the auth token from local storage or cookies
 * (Adjust this based on how you store your Supabase/JWT token)
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // or your specific token key
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

export const testimonialService = {
    // 1. Get testimonials (Public/Admin)
    getByPage: async (pageTag) => {
        try {
            const res = await fetch(`${baseUrl}/testimonials?page=${encodeURIComponent(pageTag)}`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error('Failed to fetch testimonials');
            return await res.json();
        } catch (error) {
            console.error("Testimonial Fetch Error:", error);
            return [];
        }
    },

    // 2. Create Testimonial (Admin Protected)
    create: async (data) => {
        const res = await fetch(`${baseUrl}/testimonials`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to create testimonial');
        }
        return res.json();
    },

    // 3. Update Testimonial (Admin Protected)
    update: async (id, data) => {
        const res = await fetch(`${baseUrl}/testimonials/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update testimonial');
        }
        return res.json();
    },

    // 4. Delete Testimonial (Admin Protected)
    delete: async (id) => {
        const res = await fetch(`${baseUrl}/testimonials/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete testimonial');
        }
        return res.json();
    }
};