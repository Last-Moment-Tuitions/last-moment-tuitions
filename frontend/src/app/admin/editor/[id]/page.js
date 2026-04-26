'use client';

import { Editor } from '@/features/editor/components/Editor';
import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function AdminEditorPage({ params }) {
    const [id, setId] = useState(null);

    useEffect(() => {
        if (params instanceof Promise) {
            params.then(p => setId(p.id));
        } else {
            setId(params.id);
        }
    }, [params]);

    if (!id) return <div>Loading...</div>;

    return (
        <>
            <Script src="https://cdn.ckeditor.com/4.25.1-lts/full-all/ckeditor.js" strategy="beforeInteractive" />
            <Editor pageId={id} />
        </>
    );
}
