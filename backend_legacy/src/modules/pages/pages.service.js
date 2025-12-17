const Page = require('./pages.model');

class PagesService {
    async findAll(queryObj) {
        const { folder, type } = queryObj;
        let query = {};

        // Filter by Folder: if provided, match logic
        // If query is ?folder=null (root), match null.
        if (folder !== undefined) {
            query.folder = (folder === 'null' || !folder) ? null : folder;
        }

        if (type) query.type = type;

        return await Page.find(query)
            .select('title slug updatedAt folder type status viewCount')
            .sort({ updatedAt: -1 });
    }

    async findById(id) {
        return await Page.findById(id);
    }

    async findBySlug(slug) {
        return await Page.findOne({ slug });
    }

    async create(pageData) {
        // If creating a Standard Page (not a template), inject global layout logic
        if (pageData.type === 'page' || !pageData.type) {
            await this._ensureGlobalTemplates();
            this._injectDefaultContent(pageData);
        }

        return await Page.create(pageData);
    }

    async update(id, updateData) {
        return await Page.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
    }

    async delete(id) {
        return await Page.deleteOne({ _id: id });
    }

    async incrementView(id) {
        return await Page.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true });
    }

    // --- Private Helpers ---

    async _ensureGlobalTemplates() {
        // 1. Ensure Global Header Exists
        let header = await Page.findOne({ slug: 'global-header', type: 'template' });
        if (!header) {
            header = await Page.create({
                title: 'Global Header',
                slug: 'global-header',
                type: 'template',
                gjsHtml: '<div style="background:#fff; padding:15px; border-bottom:1px solid #ddd; position:sticky; top:0; z-index:50;"><strong>LOGO</strong> <a href="/">Home</a></div>',
                gjsCss: '',
                gjsComponents: [{ tagName: 'div', style: { position: 'sticky', top: '0', 'z-index': '50', background: 'white', padding: '15px' }, content: '<strong>LOGO</strong> <a href="/">Home</a>' }]
            });
        }

        // 2. Ensure Global Footer Exists
        let footer = await Page.findOne({ slug: 'global-footer', type: 'template' });
        if (!footer) {
            footer = await Page.create({
                title: 'Global Footer',
                slug: 'global-footer',
                type: 'template',
                gjsHtml: '<div style="background:#111; color:#fff; padding:20px; text-align:center;">&copy; 2025 Last Moment Tuitions</div>',
                gjsCss: '',
                gjsComponents: [{ tagName: 'div', style: { background: '#111', color: '#fff', padding: '30px', 'text-align': 'center' }, content: '&copy; 2025 Last Moment Tuitions' }]
            });
        }
    }

    _injectDefaultContent(pageData) {
        // 3. Inject References if no content provided
        if (!pageData.gjsComponents || pageData.gjsComponents.length === 0) {
            // Note: In a real service, we might not want to query for IDs again here if we just created them.
            // However, to keep it simple and stateless-ish:
            // We assume _ensureGlobalTemplates ensures they exist.
            // Ideally we'd return the IDs from _ensureGlobalTemplates.
            // But let's just do a quick lookup or better yet, refactor _ensureGlobalTemplates to return them.
            // For now, let's keep it close to the original logic which re-queried or had variables scope.
            // I'll leave references empty in this snippet if I can't easily get IDs without another query.
            // Actually, I can just query them again or improvement: return them.
        }

        // REVISITING: The original code logic queried them right inside the block.
        // Let's improve this helper to do it properly.
    }
}

// Redefining create to handle the async complexity better inside the method directly
class ImprovedPagesService {
    async findAll(queryObj) {
        const { folder, type } = queryObj;
        let query = {};
        if (folder !== undefined) {
            query.folder = (folder === 'null' || !folder) ? null : folder;
        }
        if (type) query.type = type;
        return await Page.find(query).select('title slug updatedAt folder type status viewCount').sort({ updatedAt: -1 });
    }

    async findById(id) { return await Page.findById(id); }
    async findBySlug(slug) { return await Page.findOne({ slug }); }

    async create(pageData) {
        if (pageData.type === 'page' || !pageData.type) {
            const headerId = await this._getOrCreateTemplate('global-header', 'Global Header',
                '<div style="background:#fff; padding:15px; border-bottom:1px solid #ddd; position:sticky; top:0; z-index:50;"><strong>LOGO</strong> <a href="/">Home</a></div>',
                [{ tagName: 'div', style: { position: 'sticky', top: '0', 'z-index': '50', background: 'white', padding: '15px' }, content: '<strong>LOGO</strong> <a href="/">Home</a>' }]
            );

            const footerId = await this._getOrCreateTemplate('global-footer', 'Global Footer',
                '<div style="background:#111; color:#fff; padding:20px; text-align:center;">&copy; 2025 Last Moment Tuitions</div>',
                [{ tagName: 'div', style: { background: '#111', color: '#fff', padding: '30px', 'text-align': 'center' }, content: '&copy; 2025 Last Moment Tuitions' }]
            );

            if (!pageData.gjsComponents || pageData.gjsComponents.length === 0) {
                pageData.gjsComponents = [
                    { type: 'template-ref', attributes: { id: headerId.toString() } },
                    { tagName: 'div', classes: ['main-content'], style: { 'min-height': '80vh', padding: '20px' }, content: 'Start building your page here...' },
                    { type: 'template-ref', attributes: { id: footerId.toString() } }
                ];
                pageData.gjsHtml = `<template-ref id="${headerId}"></template-ref><div class="main-content" style="min-height:80vh; padding:20px;">Start building your page here...</div><template-ref id="${footerId}"></template-ref>`;
            }
        }
        return await Page.create(pageData);
    }

    async update(id, data) {
        return await Page.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    async delete(id) { return await Page.deleteOne({ _id: id }); }
    async incrementView(id) { return await Page.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true }); }

    async _getOrCreateTemplate(slug, title, html, components) {
        let template = await Page.findOne({ slug, type: 'template' });
        if (!template) {
            template = await Page.create({
                title, slug, type: 'template', gjsHtml: html, gjsCss: '', gjsComponents: components
            });
        }
        return template._id;
    }
}

module.exports = new ImprovedPagesService();
