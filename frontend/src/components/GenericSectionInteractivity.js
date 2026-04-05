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

        // 0. Execute any <script> tags injected via dangerouslySetInnerHTML
        //    React doesn't execute them, so we re-create them as real DOM <script> elements.
        const pageContainer = document.querySelector('main');
        if (pageContainer) {
            const inlineScripts = pageContainer.querySelectorAll('script');
            inlineScripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                // Copy all attributes (src, type, async, etc.)
                Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                // Copy inline script content
                newScript.textContent = oldScript.textContent;
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
        }

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

        // ── 4. Course Detail Page: Left Sidebar Nav → Content Panel Switcher ────────
        // When a user clicks a left nav item ([data-sidebar-item]), 
        // the associated right-hand content panel is activated exclusively.
        initCourseDetailPage();

        // Cleanup
        return () => {
            sliderIntervals.forEach(interval => clearInterval(interval));
        };
    }, []);

    return null;
}

/**
 * Initializes Course Detail Page interactivity:
 * - Left sidebar item click → shows matching content panel, hides others
 * - Top content-tab click → smooth scrolls to anchor section within active panel
 * Also exported so templateRef.js can re-use it in the editor preview.
 */
export function initCourseDetailPage(root = document) {
    // ── Left Sidebar Navigation ─────────────────────────────────────────────
    const sidebarItems = root.querySelectorAll('[data-sidebar-item]');
    const allSidebarSections = root.querySelectorAll('[data-sidebar-section]');

    if (sidebarItems.length > 0) {
        // Helper: activate a sidebar item by its index
        const activateSidebarItem = (targetIdx) => {
            sidebarItems.forEach((item, i) => {
                const isActive = String(i + 1) === String(targetIdx);
                // Highlight active sidebar item
                item.style.borderLeftColor = isActive ? '#f97316' : 'transparent';
                item.style.background = isActive ? '#fff7ed' : 'transparent';
                item.style.color = isActive ? '#ea580c' : '#374151';
                item.style.fontWeight = isActive ? '600' : '500';
            });

            // Show matching section, hide others
            allSidebarSections.forEach(section => {
                const idx = section.getAttribute('data-sidebar-section');
                section.style.display = String(idx) === String(targetIdx) ? 'block' : 'none';
            });
        };

        // Activate first item by default
        activateSidebarItem(1);

        // Bind click handlers
        sidebarItems.forEach((item, i) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                activateSidebarItem(i + 1);
            });
        });
    }

    // ── Top Content Tab → Smooth Scroll ────────────────────────────────────
    // Top tabs use data-content-tab attribute and link to section IDs
    const contentTabBtns = root.querySelectorAll('[data-content-tab]');

    if (contentTabBtns.length > 0) {
        // Highlight active tab based on scroll position
        const updateActiveTab = () => {
            const sections = root.querySelectorAll('[data-content-section]');
            let currentId = null;
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100) {
                    currentId = section.id;
                }
            });
            contentTabBtns.forEach(btn => {
                const targetId = btn.getAttribute('href')?.replace('#', '') || btn.getAttribute('data-content-tab-target');
                const isActive = targetId === currentId;
                btn.style.borderBottom = isActive ? '2px solid #f97316' : '2px solid transparent';
                btn.style.color = isActive ? '#0f172a' : '#64748b';
                btn.style.fontWeight = isActive ? '700' : '600';
            });
        };

        // Bind click: smooth scroll to section
        contentTabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const href = btn.getAttribute('href') || `#content-tab-${btn.getAttribute('data-content-tab')}`;
                const targetId = href.replace('#', '');
                const targetEl = root.getElementById ? root.getElementById(targetId) : root.querySelector(`#${targetId}`);

                if (targetEl) {
                    const offset = 80; // sticky nav height
                    const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });

                    // Manually update active state immediately
                    contentTabBtns.forEach(b => {
                        b.style.borderBottom = '2px solid transparent';
                        b.style.color = '#64748b';
                        b.style.fontWeight = '600';
                    });
                    btn.style.borderBottom = '2px solid #f97316';
                    btn.style.color = '#0f172a';
                    btn.style.fontWeight = '700';
                }
            });
        });

        // Update active tab on scroll
        window.addEventListener('scroll', updateActiveTab, { passive: true });
        updateActiveTab(); // initial call
    }
}
