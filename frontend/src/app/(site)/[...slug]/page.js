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
        const res = await fetch(`${API_BASE_URL}/pages/slug/${slug}`, {
            // Revalidate every 60 seconds (ISR)
            next: { revalidate: 60 }
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
        const res = await fetch(`${API_BASE_URL}/pages/id/${id}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (e) {
        console.error(`Failed to fetch template ${id}`, e);
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

    for (const [key, rawValue] of Object.entries(propsObj)) {
        if (rawValue === undefined || rawValue === null) continue;
        const value = String(rawValue);
        const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const propRegex = new RegExp(`{{\\s*${safeKey}\\s*}}`, 'g');
        hydratedHtml = hydratedHtml.replace(propRegex, value);
    }

    for (const [key, rawValue] of Object.entries(propsObj)) {
        if (rawValue === undefined || rawValue === null) continue;
        const value = String(rawValue);
        const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const textRegex = new RegExp(`(<[^>]+data-var=["']${safeKey}["'][^>]*>)([\\s\\S]*?)(<\\/[a-z0-9-]+>)`, 'gi');
        hydratedHtml = hydratedHtml.replace(textRegex, (_m, openTag, _inner, closeTag) => `${openTag}${value}${closeTag}`);

        const srcRegex = new RegExp(`(<[^>]+data-var-src=["']${safeKey}["'][^>]*>)`, 'gi');
        hydratedHtml = hydratedHtml.replace(srcRegex, (tag) => {
            if (/(src=["'][^"']*["'])/i.test(tag)) {
                return tag.replace(/src=["'][^"']*["']/i, `src="${value}"`);
            }
            return tag.replace(/>$/, ` src="${value}">`);
        });

        const videoRegex = new RegExp(`(<[^>]+data-var-video=["']${safeKey}["'][^>]*>)`, 'gi');
        hydratedHtml = hydratedHtml.replace(videoRegex, (tag) => {
            if (/(src=["'][^"']*["'])/i.test(tag)) {
                return tag.replace(/src=["'][^"']*["']/i, `src="${value}"`);
            }
            return tag.replace(/>$/, ` src="${value}">`);
        });

        const linkRegex = new RegExp(`(<[^>]+data-var-link=["']${safeKey}["'][^>]*>)`, 'gi');
        hydratedHtml = hydratedHtml.replace(linkRegex, (tag) => {
            if (/(href=["'][^"']*["'])/i.test(tag)) {
                return tag.replace(/href=["'][^"']*["']/i, `href="${value}"`);
            }
            return tag.replace(/>$/, ` href="${value}">`);
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

            const hydratedHtml = applyTemplateProps(templateData.gjsHtml || '', mergedProps);
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
