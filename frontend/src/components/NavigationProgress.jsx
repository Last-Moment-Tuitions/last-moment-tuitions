'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationProgress() {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [width, setWidth] = useState(0);
    const prevPathnameRef = useRef(pathname);
    const t1 = useRef(null);
    const t2 = useRef(null);
    const t3 = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('/')) return;
            // Normalise: strip query/hash for comparison
            const targetPath = href.split('?')[0].split('#')[0];
            if (targetPath === window.location.pathname) return;

            clearTimeout(t1.current);
            clearTimeout(t2.current);
            clearTimeout(t3.current);
            setVisible(true);
            setWidth(15);
            t1.current = setTimeout(() => setWidth(40), 250);
            t2.current = setTimeout(() => setWidth(70), 900);
        };

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
            clearTimeout(t1.current);
            clearTimeout(t2.current);
            clearTimeout(t3.current);
        };
    }, []);

    // Route changed → complete the bar
    useEffect(() => {
        if (prevPathnameRef.current === pathname) return;
        prevPathnameRef.current = pathname;

        clearTimeout(t1.current);
        clearTimeout(t2.current);
        clearTimeout(t3.current);

        setWidth(100);
        t3.current = setTimeout(() => {
            setVisible(false);
            setWidth(0);
        }, 350);
    }, [pathname]);

    if (!visible) return null;

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '3px',
                width: `${width}%`,
                background: 'linear-gradient(90deg, #063f78, #2563eb)',
                zIndex: 99999,
                transition: width === 100 ? 'width 0.25s ease-out' : 'width 0.5s ease-out',
                boxShadow: '0 0 10px rgba(37, 99, 235, 0.5)',
                borderRadius: '0 2px 2px 0',
            }}
        />
    );
}
