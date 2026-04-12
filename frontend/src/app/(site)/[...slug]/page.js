import { notFound } from 'next/navigation';
import { Button } from '@/components/ui';
import ViewTracker from '@/components/ViewTracker';
import GenericSectionInteractivity from '@/components/GenericSectionInteractivity';

import API_BASE_URL from '@/lib/config';

// This function fetches data from the backend
async function getPageData(slugArray) {
    const slug = slugArray.join('/'); // e.g. "summer-bootcamp"

    try {
        // Use the new slug-specific endpoint
        // Revalidate every 0 seconds for testing - force fresh data
        const res = await fetch(`${API_BASE_URL}/pages/slug/${slug}`, {
            next: { revalidate: 0 }
        });

        if (!res.ok) return null;

        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error('Failed to fetch page:', error);
        return null;
    }
}

// Block Renderers
const HeroBlock = ({ data }) => (
    <section className="relative bg-gray-900 text-white py-20 px-6 overflow-hidden">
        <div className="container mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">{data.headline}</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">{data.subtext}</p>
            <div className="flex justify-center gap-4">
                <Button variant="primary" className="px-8 py-3 rounded-full text-lg">Get Started</Button>
            </div>
        </div>
        {/* Background decorative elements could go here */}
    </section>
);

const TextBlock = ({ data }) => (
    <section className="container mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">
            {/* Warning: dangerouslySetInnerHTML should be sanitized in production */}
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
        </div>
    </section>
);

const BlockRenderer = ({ block }) => {
    switch (block.type) {
        case 'hero': return <HeroBlock data={block.data} />;
        case 'text': return <TextBlock data={block.data} />;
        default: return null;
    }
};

// Helper to fetch template content by ID
async function getTemplateContent(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/pages/id/${id}`, { next: { revalidate: 0 } });
        if (!res.ok) return null;
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (e) {
        console.error(`Failed to fetch template ${id}`, e);
        return null;
    }
}

// Helper to fetch testimonial data by ID
async function getTestimonialContent(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/testimonials/${id}`, { next: { revalidate: 0 } });
        if (!res.ok) return null;
        const json = await res.json();
        
        // FLEXIBLE UNWRAP: Handle both { success, details/data } wrappers and raw objects
        if (json && typeof json === 'object') {
            if (json.success === true) {
                return json.details || json.data || json;
            }
            return json; // Backend returns the raw student object directly
        }
        return null;
    } catch (e) {
        console.error(`[Hydration] Failed to fetch testimonial ${id}:`, e.message);
        return null;
    }
}

function parseDataProps(raw) {
    if (!raw) return {};
    try {
        const decoded = raw
            .replace(/&quot;/g, '"')
            .replace(/&#34;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&#39;/g, "'");
        const parsed = JSON.parse(decoded);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

function applyTemplateProps(templateHtml, propsObj) {
    if (!templateHtml) return '';
    if (!propsObj || Object.keys(propsObj).length === 0) return templateHtml;

    let hydratedHtml = templateHtml;

    // First pass: {{ Mustache }} style replacement
    for (const [key, rawValue] of Object.entries(propsObj)) {
        if (rawValue === undefined || rawValue === null) continue;
        const value = String(rawValue);
        
        // Try both key and key without prop_ prefix
        const varName = key.replace(/^prop_/, '');
        [key, varName].forEach(k => {
            const safeK = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const propRegex = new RegExp(`{{\\s*${safeK}\\s*}}`, 'g');
            hydratedHtml = hydratedHtml.replace(propRegex, value);
        });
    }

    // Second pass: data-var/data-var-src etc. attributes
    for (const [key, rawValue] of Object.entries(propsObj)) {
        if (rawValue === undefined || rawValue === null) continue;
        const value = String(rawValue);
        const varName = key.replace(/^prop_/, '');

        // Support both names in regex
        const searchNames = key === varName ? [key] : [key, varName];
        searchNames.forEach(k => {
            const safeK = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Text content
            const textRegex = new RegExp(`(<[^>]+data-var=["']${safeK}["'][^>]*>)([\\s\\S]*?)(<\\/[a-z0-9-]+>)`, 'gi');
            hydratedHtml = hydratedHtml.replace(textRegex, (_m, openTag, _inner, closeTag) => `${openTag}${value}${closeTag}`);

            // Image Src
            const srcRegex = new RegExp(`(<[^>]+data-var-src=["']${safeK}["'][^>]*>)`, 'gi');
            hydratedHtml = hydratedHtml.replace(srcRegex, (tag) => {
                if (/(src=["'][^"']*["'])/i.test(tag)) {
                    return tag.replace(/src=["'][^"']*["']/i, `src="${value}"`);
                }
                return tag.replace(/>$/, ` src="${value}">`);
            });

            // Video Src
            const videoRegex = new RegExp(`(<[^>]+data-var-video=["']${safeK}["'][^>]*>)`, 'gi');
            hydratedHtml = hydratedHtml.replace(videoRegex, (tag) => {
                if (/(src=["'][^"']*["'])/i.test(tag)) {
                    return tag.replace(/src=["'][^"']*["']/i, `src="${value}"`);
                }
                return tag.replace(/>$/, ` src="${value}">`);
            });

            // Link Href
            const linkRegex = new RegExp(`(<[^>]+data-var-link=["']${safeK}["'][^>]*>)`, 'gi');
            hydratedHtml = hydratedHtml.replace(linkRegex, (tag) => {
                if (/(href=["'][^"']*["'])/i.test(tag)) {
                    return tag.replace(/href=["'][^"']*["']/i, `href="${value}"`);
                }
                return tag.replace(/>$/, ` href="${value}">`);
            });
        });
    }

    return hydratedHtml;
}

function parseAttributesFromTag(tag) {
    const attrs = {};
    const attrRegex = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)')/g;
    let match;
    while ((match = attrRegex.exec(tag)) !== null) {
        const key = match[1];
        const value = match[3] ?? match[4] ?? '';
        attrs[key] = value;
    }
    return attrs;
}

// Recursive function to resolve <template-ref> tags
async function resolveTemplateRefs(html, templateCache = new Map(), seenIds = new Set()) {
    if (!html) return html;

    const tagRegex = /<template-ref\b[^>]*?(?:\/>|>[\s\S]*?<\/template-ref>)/gi;
    const refs = [...html.matchAll(tagRegex)];
    if (refs.length === 0) return html;

    let resolvedHtml = html;

    for (const refMatch of refs) {
        const fullTag = refMatch[0];
        const attrs = parseAttributesFromTag(fullTag);
        const templateId = attrs['data-template-id'] || attrs.id;
        if (!templateId) {
            resolvedHtml = resolvedHtml.replace(fullTag, '');
            continue;
        }

        if (seenIds.has(templateId)) {
            console.warn('[template-resolver] Circular template reference detected:', templateId);
            resolvedHtml = resolvedHtml.replace(fullTag, '');
            continue;
        }

        try {
            let templateData = templateCache.get(templateId);
            if (!templateData) {
                templateData = await getTemplateContent(templateId);
                templateCache.set(templateId, templateData || null);
            }

            if (!templateData) {
                resolvedHtml = resolvedHtml.replace(fullTag, '');
                continue;
            }

            const overrideProps = parseDataProps(attrs['data-props'] || '');
            const mergedProps = {
                ...(templateData.defaultProps || {}),
                ...overrideProps,
            };

            let templateHtml = templateData.gjsHtml || '';

            // ─── START: Dynamic Testimonial Hydration ───
            const isTestimonials = templateData.slug === 'lmt-testimonials' || 
                                 templateData.title?.toLowerCase().includes('testimonials') ||
                                 templateId === '69bedd85babf20277b80c00639a60a20';

            if (isTestimonials) {
                console.log(`[Hydration] Detected Testimonial Template: slug="${templateData.slug}", id=${templateId}`);
                const selectedIdsStr = mergedProps.prop_selected_ids || mergedProps.selected_ids || '';
                const selectedIds = selectedIdsStr.split(',').filter(Boolean);
                
                console.log(`[Hydration] Selected IDs: [${selectedIds.join(', ')}]`);

                if (selectedIds.length > 0) {
                    try {
                        const studentData = await Promise.all(selectedIds.map(id => getTestimonialContent(id)));
                        const validStudents = studentData.filter(Boolean);
                        
                        console.log(`[Hydration] Successfully fetched ${validStudents.length}/${selectedIds.length} students`);
                        
                        let cardsHtml = '';
                        validStudents.forEach((student, i) => {
                            // Mirroring exact HTML structure from templateRef.js
                            cardsHtml += `
                                <div data-testimonial style="flex:0 0 320px; background:#fff; border-radius:16px; padding:32px; box-shadow:0 10px 25px rgba(0,0,0,0.05); border:1px solid #f1f5f9; display:flex; flex-direction:column; min-height:280px; scroll-snap-align:start;">
                                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
                                        <img src="https://placehold.co/40" style="width:32px; height:32px; object-fit:contain; border-radius:50%;" />
                                        <span style="font-weight:700; font-size:18px; color:#334155; text-transform:uppercase;" data-var="test_card${i + 1}_badge">{{test_card${i + 1}_badge}}</span>
                                    </div>
                                    <p style="font-size:15px; color:#475569; line-height:1.6; flex:1; margin:0 0 32px 0;">${student.message || ''}</p>
                                    <div style="display:flex; align-items:center; gap:16px;">
                                        <img src="${student.image || `https://i.pravatar.cc/60?img=${i + 10}`}" style="width:48px; height:48px; border-radius:50%; object-fit:cover;" />
                                        <div>
                                            <div style="font-weight:700; font-size:15px; color:#1e293b;">${student.name || ''}</div>
                                            <div style="font-size:13px; color:#64748b;">${(student.target_pages || []).join(', ') || 'Learner'}</div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        });

                        // Inject the generated cards into the track
                        if (templateHtml.includes('test-track')) {
                            console.log(`[Hydration] Injecting cards into test-track...`);
                            
                            const trackMarkers = ['class="test-track"', 'class=\'test-track\'', 'test-track'];
                            let startIndex = -1;
                            for (const m of trackMarkers) {
                                startIndex = templateHtml.indexOf(m);
                                if (startIndex !== -1) break;
                            }

                            if (startIndex !== -1) {
                                const tagStart = templateHtml.lastIndexOf('<', startIndex);
                                const openingTagEnd = templateHtml.indexOf('>', startIndex) + 1;
                                
                                // Find matching </div>
                                let depth = 1;
                                let currentIndex = openingTagEnd;
                                while (depth > 0 && currentIndex < templateHtml.length) {
                                    const nextOpen = templateHtml.indexOf('<div', currentIndex);
                                    const nextClose = templateHtml.indexOf('</div>', currentIndex);
                                    if (nextClose === -1) break;
                                    if (nextOpen !== -1 && nextOpen < nextClose) {
                                        depth++;
                                        currentIndex = nextOpen + 4;
                                    } else {
                                        depth--;
                                        currentIndex = nextClose + 6;
                                    }
                                }
                                const closingTagStart = currentIndex - 6;
                                templateHtml = templateHtml.substring(0, openingTagEnd) + cardsHtml + templateHtml.substring(closingTagStart);
                                console.log(`[Hydration] HTML replacement complete. New length: ${templateHtml.length}`);
                            }
                        } else {
                            console.warn('[Hydration] .test-track container NOT FOUND in template HTML!');
                        }
                    } catch (err) {
                        console.error('[Hydration] FATAL ERROR during card generation:', err);
                    }
                } else {
                    console.log('[Hydration] NO SELECTED IDs FOUND in mergedProps');
                }
            } else {
                // Not a testimonials template, skip hydration
            }
            // ─── END: Dynamic Testimonial Hydration ───
            // ─── END: Dynamic Testimonial Hydration ───

            const hydratedHtml = applyTemplateProps(templateHtml, mergedProps);
            const resolvedNestedHtml = await resolveTemplateRefs(
                hydratedHtml,
                templateCache,
                new Set([...seenIds, templateId])
            );

            const css = templateData.gjsCss ? `<style>${templateData.gjsCss}</style>` : '';
            resolvedHtml = resolvedHtml.replace(fullTag, `${css}${resolvedNestedHtml || ''}`);
        } catch (e) {
            console.error(`Failed to resolve template ${templateId}`, e);
            resolvedHtml = resolvedHtml.replace(fullTag, '');
        }
    }

    return resolvedHtml;
}

export default async function DynamicPage({ params }) {
    // Next.js 15: params is a promise
    const resolvedParams = await params;
    const slugArray = resolvedParams.slug;
    // const slug = slugArray.join('/'); // Fixed: Do not join here, pass array to getPageData

    const page = await getPageData(slugArray); // Function named getPageData, not getPage

    if (!page) {
        notFound();
    }

    // Resolve templates
    const finalHtml = await resolveTemplateRefs(page.gjsHtml);

    return (
        <main>
            <ViewTracker pageId={page._id} />
            {finalHtml ? (
                <>
                    {page.gjsCss && <style dangerouslySetInnerHTML={{ __html: page.gjsCss }} />}
                    <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
                    <GenericSectionInteractivity />
                </>
            ) : (
                <div className="py-20 text-center">
                    <h1 className="text-4xl font-bold">{page.title}</h1>
                    <p className="mt-4 text-gray-600">This page is built with the legacy system or is empty.</p>
                </div>
            )}
        </main>
    );
}

// Generate Metadata for SEO
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const page = await getPageData(slug);

    if (!page) return {};

    return {
        title: `${page.title} | Last Moment Tuitions`,
        description: page.metaDescription,
    };
}
