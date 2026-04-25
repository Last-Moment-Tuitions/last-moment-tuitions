'use client';

import { useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/lib/config';

export default function ViewTracker({ pageId }) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (!pageId || hasTracked.current) return;

        // Simple fire-and-forget view count increment
        const sessionKey = `viewed-page-${pageId}`;
        if (sessionStorage.getItem(sessionKey)) return;

        const trackView = async () => {
            try {
                await axios.patch(`${API_BASE_URL}/pages/${pageId}/view`);
                sessionStorage.setItem(sessionKey, 'true');
                hasTracked.current = true;
            } catch (error) {
            }
        };

        trackView();
    }, [pageId]);

    return null;
}
