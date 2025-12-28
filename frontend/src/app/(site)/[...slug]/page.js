import { notFound } from 'next/navigation';
import { Button } from '@/components/ui';

// This function fetches data from the backend
async function getPageData(slugArray) {
    const slug = slugArray.join('/'); // e.g. "summer-bootcamp"
    // Use NEXT_PUBLIC_API_URL for production backend, fallback to localhost:3001/api 
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';

    try {
        // Use the new slug-specific endpoint
        const res = await fetch(`${baseUrl}/pages/slug/${slugString}`, {
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

    // Find all <template-ref> tags
    const regex = /<template-ref\s+id="([^"]+)"[^>]*><\/template-ref>/g; // Updated regex
    let match;
    let resolvedHtml = html;

    // We need to process matches sequentially to avoid issues with string replacement
    // However, string replacement on a mutating string is tricky with regex exec
    // Better approach: collect all replacements first
    const replacements = [];

    while ((match = regex.exec(html)) !== null) {
        const [fullTag, templateId] = match;
        replacements.push({ fullTag, templateId });
    }

    // Fetch and replace
    for (const { fullTag, templateId } of replacements) {
        try {
            // Fetch the template content
            const res = await fetch(`${API_BASE_URL}/pages/id/${templateId}`, {
                cache: 'no-store' // Updated cache strategy
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data) {
                    // Recursively resolve references in the template itself
                    const innerContent = await resolveTemplateRefs(data.data.gjsHtml);
                    resolvedHtml = resolvedHtml.replace(fullTag, innerContent || '');
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
            <Header />
            <ViewTracker pageId={page._id} />
            {finalHtml ? (
                <>
                    {page.gjsCss && <style dangerouslySetInnerHTML={{ __html: page.gjsCss }} />}
                    <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
                </>
            ) : (
                <div className="py-20 text-center">
                    <h1 className="text-4xl font-bold">{page.title}</h1>
                    <p className="mt-4 text-gray-600">This page is built with the legacy system or is empty.</p>
                    {/* Legacy Block Rendering Fallback could go here */}
                </div>
            )}
            <Footer />
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
