'use client';

import { Editor } from '@/features/editor/components/Editor';
import { use, useState, useEffect } from 'react';

export default function EditorPage({ params }) {
    // Next.js 15+ handling of params
    // If params is a promise, we should unwrap it.
    // We can use a small wrapper or simple state.
    const [id, setId] = useState(null);

    useEffect(() => {
        if (params instanceof Promise) {
            params.then(p => setId(p.id));
        } else {
            setId(params.id);
        }
    }, [params]);

    if (!id) return <div>Loading...</div>;

    return <Editor pageId={id} />;
}
