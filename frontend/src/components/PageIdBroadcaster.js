'use client';

import { useEffect } from 'react';
import { usePage } from '@/context/PageContext';

/**
 * Invisible client component rendered inside server-side slug pages.
 * It registers the current CMS page ID into PageContext so the Header
 * can build a direct "Edit this Page" link → /admin/editor/[id].
 */
export default function PageIdBroadcaster({ pageId }) {
    const { setPageId } = usePage();

    useEffect(() => {
        setPageId(pageId);
        // Clear when navigating away
        return () => setPageId(null);
    }, [pageId, setPageId]);

    return null;
}
