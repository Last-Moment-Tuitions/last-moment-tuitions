// Ensure you have NEXT_PUBLIC_BACKEND_URL defined in your .env.local file
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Safety check: Fallback only if absolutely necessary, 
// but NEXT_PUBLIC_ ensures it's available in the browser.
const baseUrl = `${BACKEND_URL}/api`;

const getAuthHeaders = () => {
    // Check if window is defined to prevent errors during SSR (Server Side Rendering)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

export const testimonialService = {
    // 1. Get testimonials (Public/Admin)
    getByPage: async (pageTag) => {
        try {
            // Updated parameter name to 'target_page' to match your NestJS Controller @Query
            const res = await fetch(`${baseUrl}/testimonials?target_page=${encodeURIComponent(pageTag)}`, {
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