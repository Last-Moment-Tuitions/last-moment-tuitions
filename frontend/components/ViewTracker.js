'use client';

import { useEffect } from 'react';
import axios from 'axios';

export default function ViewTracker({ pageId }) {
    useEffect(() => {
        if (!pageId) return;

        // Simple fire-and-forget view count increment
        const trackView = async () => {
            try {
                // Use a session storage flag to prevent double-counting on strict-mode/dev re-renders if desired,
                // but for simple MVP, just calling it is fine.
                // We'll add a simple check to avoid counting the same session repeatedly if needed later.
                await axios.post(`http://localhost:3005/api/pages/${pageId}/view`);
            } catch (error) {
                console.error('Failed to track view:', error);
            }
        };

        trackView();
    }, [pageId]);

    return null;
}
