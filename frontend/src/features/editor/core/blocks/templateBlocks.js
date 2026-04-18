/**
 * templateBlocks.js — Generic Section Auto-Discovery Layer
 * 
 * Fetches all `type: template` documents from the API and registers each one
 * as a draggable GrapeJS block. The block content references the template by ID,
 * which is then rendered and made editable by templateRef.js.
 */

// Maps section category → editor block panel group label
const CATEGORY_LABELS = {
    hero: '🦸 Hero Sections',
    faq: '❓ FAQ Sections',
    curriculum: '📚 Curriculum',
    cta: '📣 CTA Sections',
    testimonials: '⭐ Testimonials',
    features: '⚡ Feature Sections',
    courses: '🎓 Course Sections',
    general: '🧩 Sections',
};

// Block thumbnail SVG icon (generic section icon)
const SECTION_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
  <rect x="2" y="3" width="20" height="18" rx="2" stroke="#f97316" stroke-width="1.5"/>
  <path d="M2 8h20" stroke="#f97316" stroke-width="1.5"/>
  <path d="M6 13h12M6 16h8" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

/**
 * Load and register all reusable section templates as GrapeJS blocks.
 * 
 * @param {object} editor - The GrapeJS editor instance
 */
export const loadTemplateBlocks = async (editor) => {
    try {
        // Dynamically import config to avoid SSR issues in Next.js
        const configModule = await import('@/lib/config');
        const API_BASE_URL = configModule.default;

        // Fetch all published templates
        const res = await fetch(`${API_BASE_URL}/pages?type=template&status=all`);
        const json = await res.json();
        const templates = Array.isArray(json) ? json : (json.data || []);

        if (templates.length === 0) {
            console.warn('[templateBlocks] No templates found.');
            return;
        }

        // Guard: editor may have been destroyed
        if (!editor || !editor.BlockManager) {
            return;
        }

        // Filter out global header/footer
        const sections = templates.filter(t =>
            t.slug !== 'global-header' && t.slug !== 'global-footer'
        );

        sections.forEach(template => {
            if (!editor || !editor.BlockManager) return;

            const blockCategory = CATEGORY_LABELS[template.category] || '🧩 Sections';
            const blockId = `tpl-section-${template._id}`;

            if (editor.BlockManager.get(blockId)) return;

            editor.BlockManager.add(blockId, {
                label: `
                    <div style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:4px 0;">
                        ${SECTION_ICON}
                        <div style="font-size:11px; font-weight:600; text-align:center; line-height:1.3; color:#e5e7eb;">
                            ${template.title || 'Untitled Section'}
                        </div>
                        ${template.category
                        ? `<div style="font-size:10px; color:#f97316; font-weight:500;">${template.category}</div>`
                        : ''
                    }
                    </div>
                `,
                category: blockCategory,
                content: {
                    type: 'template-ref',
                    attributes: {
                        'data-template-id': template._id,
                        'data-template-slug': template.slug,
                    },
                },
                media: SECTION_ICON,
            });
        });

        console.log(`[templateBlocks] ✅ Registered ${sections.length} section block(s).`);

    } catch (err) {
        console.error('[templateBlocks] Error loading template blocks:', err);
    }
};
