const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const baseUrl = `${BACKEND_URL}/api`;

const getAuthHeaders = () => {
    if (typeof window === 'undefined') return {};

    const sessionId = document.cookie
        .split('; ')
        .find(row => row.startsWith('sessionId='))
        ?.split('=')[1];

    return {
        'Content-Type': 'application/json',
        ...(sessionId ? { 'x-session-id': sessionId } : {}),
    };
};

export const testimonialService = {
    // 1. Get testimonials (Public/Admin)
    getByPage: async (pageTag) => {
        if (!BACKEND_URL) {
            console.error("NEXT_PUBLIC_BACKEND_URL is not defined");
            throw new Error("Configuration Error: Backend URL not set");
        }

        try {
            // Construct URL - ensure no double slashes
            const url = `${baseUrl}/testimonials?target_page=${encodeURIComponent(pageTag)}`;

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                cache: 'no-store'
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Server Error: ${res.status} - ${errText}`);
            }

            const data = await res.json();

            // Check if data is wrapped in a success object (e.g. from TransformInterceptor)
            if (data && data.details && Array.isArray(data.details)) {
                return data.details;
            }

            // Fallback for direct array response
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Critical Fetch Error:", error);
            throw error; // Propagate error to UI
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