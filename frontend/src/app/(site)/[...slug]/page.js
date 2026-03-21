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

// Recursive function to resolve <template-ref> tags
async function resolveTemplateRefs(html) {
    if (!html) return html;

    // Find all <template-ref> tags, optionally matching data-props="..."
    // The previous regex was: /<template-ref[^>]*data-template-id="([^"]+)"[^>]*>([\s\S]*?)<\/template-ref>/gi;
    // We update it to optionally capture data-props if present:
    const regex = /<template-ref[^>]*(?:data-template-id="([^"]+)"[^>]*data-props='([^']+)'|data-props='([^']+)'[^>]*data-template-id="([^"]+)"|data-template-id="([^"]+)")[^>]*>([\s\S]*?)<\/template-ref>/gi;

    let match;
    let resolvedHtml = html;

    // We need to process matches sequentially to avoid issues with string replacement
    const replacements = [];

    while ((match = regex.exec(html)) !== null) {
        const fullTag = match[0];

        // Due to the regex having optional attribute capture groups in different orders,
        // we extract the values safely.
        // It's safer to extract attributes via local regex match against the full tag 
        // to avoid complex numbered capture group offsets.
        const idMatch = fullTag.match(/data-template-id="([^"]+)"/i);
        const propsMatch = fullTag.match(/data-props=(['"])(.*?)\1/i); // Matches ' or " quotes

        const templateId = idMatch ? idMatch[1] : null;
        let propsObj = {};

        if (propsMatch) {
            try {
                // Decode HTML entities if stored as such, e.g. &quot; to "
                const decodedProps = propsMatch[2].replace(/&quot;/g, '"');
                propsObj = JSON.parse(decodedProps);
            } catch (e) {
                console.error("Failed to parse data-props JSON for template:", templateId, e);
            }
        }

        if (templateId) {
            replacements.push({ fullTag, templateId, propsObj });
        }
    }

    // Fetch and replace
    for (const { fullTag, templateId, propsObj } of replacements) {
        try {
            // Fetch the template content
            const res = await fetch(`${API_BASE_URL}/pages/id/${templateId}`, {
                cache: 'no-store' // Ensure dynamic components are always fresh based on ID
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data) {
                    // Start with the raw template HTML
                    let templateHtml = data.data.gjsHtml;

                    // Interpolate props inside the template HTML
                    if (propsObj && Object.keys(propsObj).length > 0) {
                        for (const [key, value] of Object.entries(propsObj)) {
                            // Escape key for safety
                            const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                            // Replace {{ key }} or {{key}} with the value string
                            const propRegex = new RegExp(`{{\\s*${safeKey}\\s*}}`, 'g');
                            templateHtml = templateHtml.replace(propRegex, value);

                            // Replace text inside data-var="key"
                            // Match: open tag -> content -> close tag
                            const textRegex = new RegExp(`(<[^>]+data-var=["']${safeKey}["'][^>]*>)([\\s\\S]*?)(<\\/[a-z0-9]+>)`, 'gi');
                            templateHtml = templateHtml.replace(textRegex, (match, openTag, innerContent, closeTag) => {
                                return `${openTag}${value}${closeTag}`;
                            });

                            // Replace src for data-var-src="key"
                            templateHtml = templateHtml.replace(new RegExp(`(<[^>]+data-var-src=["']${safeKey}["'][^>]*>)`, 'gi'), (tag) => {
                                return tag.replace(/(src=["'])([^"']*)(["'])/i, (m, p1, p2, p3) => `${p1}${value}${p3}`);
                            });

                            // Replace href for data-var-link="key"
                            templateHtml = templateHtml.replace(new RegExp(`(<[^>]+data-var-link=["']${safeKey}["'][^>]*>)`, 'gi'), (tag) => {
                                return tag.replace(/(href=["'])([^"']*)(["'])/i, (m, p1, p2, p3) => `${p1}${value}${p3}`);
                            });

                            // Replace src for data-var-video="key"
                            templateHtml = templateHtml.replace(new RegExp(`(<[^>]+data-var-video=["']${safeKey}["'][^>]*>)`, 'gi'), (tag) => {
                                return tag.replace(/(src=["'])([^"']*)(["'])/i, (m, p1, p2, p3) => `${p1}${value}${p3}`);
                            });
                        }
                    }

                    // Recursively resolve references in the resolved template itself
                    const innerContent = await resolveTemplateRefs(templateHtml);

                    // Include the CSS of the template
                    const innerCss = data.data.gjsCss ? `<style>${data.data.gjsCss}</style>` : '';
                    resolvedHtml = resolvedHtml.replace(fullTag, innerCss + (innerContent || ''));
                } else {
                    resolvedHtml = resolvedHtml.replace(fullTag, '');
                }
            } else {
                resolvedHtml = resolvedHtml.replace(fullTag, '');
            }
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
