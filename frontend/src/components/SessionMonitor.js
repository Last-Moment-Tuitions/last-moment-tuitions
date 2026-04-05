'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * SessionMonitor Component
 * 
 * A renderless React component that monitors user session activity and automatically
 * extends or terminates sessions based on inactivity and user role.
 * 
 * Features:
 * - Tracks user activity through mouse, keyboard, click, and scroll events
 * - Monitors time since last server interaction and last user activity
 * - Automatically refreshes session when approaching expiration (if user is active)
 * - Logs out inactive users after session timeout
 * - Provides different timeout thresholds for admin vs regular users:
 *   - Admin: 3 hours session timeout, 2 hour check interval, 15 minute activity window
 *   - Regular: 1 hour session timeout, 15 minute check interval, 15 minute activity window
 * 
 * Dependencies:
 * - useAuth: Hook providing user, checkUser(), and logout() functions
 * - useRouter: Next.js router for navigation
 * - useRef: React hook for maintaining mutable references
 * - useEffect: React hook for managing listeners and intervals
 * 
 * Behavior:
 * - When session approaches expiration (within last 15 minutes):
 *   - If user was recently active: calls checkUser() to refresh Redis TTL
 *   - If user is idle: logs out after session timeout
 * - Cleans up event listeners and intervals on unmount
 * 
 * @component
 * @returns {null} Renderless component (monitoring only, no UI output)
 */
export default function SessionMonitor() {
    const { user, checkUser, logout } = useAuth();
    const lastActivity = useRef(Date.now());
    const lastServerInteraction = useRef(Date.now());
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        const isAdmin = user?.roles?.includes('admin');
        const SESSION_TIMEOUT = isAdmin ? 3 * 60 * 60 * 1000 : 60 * 60 * 1000;
        const CHECK_INTERVAL = isAdmin ?  2 * 60 * 60 * 1000 : 15 * 60 * 1000; 
        const REFRESH_THRESHOLD = isAdmin ? 3 * 60 * 60 * 1000 - (15 * 60 * 1000) : SESSION_TIMEOUT - (15 * 60 * 1000); 
        const ACTIVITY_WINDOW = isAdmin ? 3 * 60 * 60 * 1000 : 15 * 60 * 1000;

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
