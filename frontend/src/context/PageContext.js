'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const PageContext = createContext({ pageId: null, setPageId: () => {} });

export function PageProvider({ children }) {
    const [pageId, setPageId] = useState(null);

    const updatePageId = useCallback((id) => {
        setPageId(id);
    }, []);

    return (
        <PageContext.Provider value={{ pageId, setPageId: updatePageId }}>
            {children}
        </PageContext.Provider>
    );
}

export const usePage = () => useContext(PageContext);
