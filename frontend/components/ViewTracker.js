'use client';

import { useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/lib/config';

export default function ViewTracker({ pageId }) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (!pageId || hasTracked.current) return;

        // Simple fire-and-forget view count increment
        const trackView = async () => {
            try {
                // Use a session storage flag to prevent double-counting on strict-mode/dev re-renders if desired,
                // but for simple MVP, just calling it is fine.
                // We'll add a simple check to avoid counting the same session repeatedly if needed later.
                await axios.post(`${API_BASE_URL}/views`, { pageId });
                hasTracked.current = true;
            } catch (error) {
                console.error('Failed to track view:', error);
            }
        };

        trackView();
    }, [pageId]);

    return null;
}
