'use client';

import { useEffect } from 'react';

/**
 * A client component injected at the bottom of published pages to provide 
 * interactive functionality (tabs, sliders, accordions) for the Generic Sections 
 * built via GrapeJS, which lack embedded `<script>` tags by design.
 */
export default function GenericSectionInteractivity() {
    useEffect(() => {
        // Run once on mount

        // 1. Tab Switcher (e.g. Course Curriculum)
        // Group by closest section or main container
        const allTabs = document.querySelectorAll('[data-tab]');
        if (allTabs.length > 0) {
            allTabs.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();

                    const container = btn.closest('section') || btn.closest('div[style*="max-width"]');
                    if (!container) return;

                    const groupTabs = container.querySelectorAll('[data-tab]');
                    groupTabs.forEach(tabBtn => {
                        const isActive = tabBtn === btn;
                        tabBtn.style.background = isActive ? '#047857' : 'transparent';
                        tabBtn.style.color = isActive ? '#fff' : '#374151';
                        tabBtn.style.borderColor = isActive ? '#047857' : 'transparent';
                    });

                    const tabId = btn.getAttribute('data-tab');
                    const panes = container.querySelectorAll('[data-tab-pane]');
                    panes.forEach(pane => {
                        pane.style.display = pane.getAttribute('data-tab-pane') === tabId ? 'block' : 'none';
                    });
                });
            });
        }

        // 2. Accordion chevron sync
        const allDetails = document.querySelectorAll('details[data-module]');
        allDetails.forEach(details => {
            const summary = details.querySelector('summary');
            const chevron = summary?.querySelector('.mod-chevron') || summary?.querySelector('span:last-child');
            if (!chevron) return;

            // Initial state based on DOM
            chevron.textContent = details.open ? '−' : '›';

            // Listen for native HTML toggle
            details.addEventListener('toggle', () => {
                chevron.textContent = details.open ? '−' : '›';
            });
        });

        // 3. Testimonial Slider Interaction
        const testTracks = document.querySelectorAll('.test-track');
        const sliderIntervals = [];

        testTracks.forEach(testTrack => {
            const container = testTrack.closest('section') || testTrack.parentElement;
            const testPrev = container.querySelector('.test-prev');
            const testNext = container.querySelector('.test-next');

            const scrollAmount = 344; // 320px width + 24px gap

            if (testPrev && testNext) {
                testPrev.addEventListener('click', (e) => {
                    e.preventDefault();
                    testTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                });

                testNext.addEventListener('click', (e) => {
                    e.preventDefault();
                    testTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                });
            }

            // Auto-slide logic
            let isHovering = false;
            testTrack.addEventListener('mouseenter', () => isHovering = true);
            testTrack.addEventListener('mouseleave', () => isHovering = false);

            const interval = setInterval(() => {
                if (isHovering || !testTrack.isConnected) return;

                // Check if we hit the end
                if (Math.ceil(testTrack.scrollLeft + testTrack.clientWidth) >= testTrack.scrollWidth) {
                    testTrack.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    testTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }, 3000);

            sliderIntervals.push(interval);
        });

        // Cleanup
        return () => {
            sliderIntervals.forEach(interval => clearInterval(interval));
        };
    }, []);

    return null;
}
