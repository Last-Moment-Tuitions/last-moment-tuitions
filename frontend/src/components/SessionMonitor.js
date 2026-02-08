'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SessionMonitor() {
    const { user, checkUser, logout } = useAuth();
    const lastActivity = useRef(Date.now());
    const lastServerInteraction = useRef(Date.now());
    const router = useRouter();

    // 60 Minutes Total Session
    // We check every 15 minutes.
    // Logic: If user is in the last 15 minutes (>= 45 mins elapsed), check if they were active in the last 15 mins.
    const CHECK_INTERVAL = 15 * 60 * 1000; // Check every 15 minutes
    const SESSION_TIMEOUT = 60 * 60 * 1000; // 60 minutes
    const REFRESH_THRESHOLD = 45 * 60 * 1000; // Start checking for refresh after 45 mins
    const ACTIVITY_WINDOW = 15 * 60 * 1000; // User must have been active in last 15 mins

    useEffect(() => {
        if (!user) return;

        const Events = ['mousemove', 'keydown', 'click', 'scroll'];

        const handleActivity = () => {
            lastActivity.current = Date.now();
        };

        // Attach listeners
        Events.forEach(event => window.addEventListener(event, handleActivity));

        const interval = setInterval(async () => {
            const now = Date.now();
            const timeSinceLastServer = now - lastServerInteraction.current;
            const timeSinceLastActivity = now - lastActivity.current;

            // Debugging (Remove in Prod)
            console.log(`[SessionMonitor] Checking... 
                Last Server: ${Math.round(timeSinceLastServer / 1000)}s ago
                Last Activity: ${Math.round(timeSinceLastActivity / 1000)}s ago
            `);

            // Only care if we are in the "Danger Zone" (last 15 minutes of session)
            if (timeSinceLastServer >= REFRESH_THRESHOLD) {

                // If user was active recently (within the last 15 mins)
                if (timeSinceLastActivity < ACTIVITY_WINDOW) {
                    console.log('[SessionMonitor] User active in last 15m. Refreshing session...');
                    try {
                        await checkUser(); // This calls /auth/me which refreshes the Redis TTL
                        lastServerInteraction.current = Date.now(); // Reset server timer
                    } catch (err) {
                        console.error('Failed to extend session', err);
                    }
                } else {
                    // Check if actually expired
                    if (timeSinceLastServer >= SESSION_TIMEOUT) {
                        console.log('[SessionMonitor] User idle for > 15m. Logging out...');
                        await logout();
                    } else {
                        console.warn(`[SessionMonitor] User idle. Will logout in ${Math.round((SESSION_TIMEOUT - timeSinceLastServer) / 60000)} minutes.`);
                    }
                }
            }

        }, CHECK_INTERVAL);

        return () => {
            Events.forEach(event => window.removeEventListener(event, handleActivity));
            clearInterval(interval);
        };
    }, [user, checkUser, logout]);

    return null; // Renderless component
}
