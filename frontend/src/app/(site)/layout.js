import React from 'react';
import SiteLayoutClient from './SiteLayoutClient';
import API_BASE_URL from '@/lib/config';
import { cookies } from 'next/headers';

async function getActiveMenu() {
    try {
        const url = `${API_BASE_URL}/menus/status/active`;
        console.log('[Server Layout] Fetching menu from:', url);
        const res = await fetch(url, {
            cache: 'no-store'
        });
        if (res.ok) {
            const responseData = await res.json();
            console.log('[Server Layout] Fetched menu successfully:', responseData.data?.name);
            return responseData.data;
        } else {
            console.error('[Server Layout] Menu fetch failed. Status:', res.status);
        }
    } catch (error) {
        console.error('[Server Layout] Failed to fetch active menu:', error);
    }
    return null;
}

export default async function SiteLayout({ children }) {
    const initialMenu = await getActiveMenu();
    return (
        <SiteLayoutClient initialMenu={initialMenu}>
            {children}
        </SiteLayoutClient>
    );
}
