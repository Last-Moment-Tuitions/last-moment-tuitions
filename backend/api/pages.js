const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const dbConnect = require('../db/connect');

// Middleware to ensure DB connection
const ensureDb = async (req, res, next) => {
    await dbConnect();
    next();
};

router.use(ensureDb);

// GET all pages (lightweight, no content)
router.get('/', async (req, res) => {
    try {
        const { folder, type } = req.query;

        let query = {};

        // Filter by Folder: if provided, match logic
        // If query is ?folder=null (root), match null.
        if (folder !== undefined) {
            query.folder = (folder === 'null' || !folder) ? null : folder;
        }

        if (type) query.type = type;

        const pages = await Page.find(query).select('title slug updatedAt folder type status viewCount').sort({ updatedAt: -1 });
        res.status(200).json({ success: true, data: pages });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// GET single page by ID (for Editor)
router.get('/id/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const page = await Page.findById(id);
        if (!page) {
            return res.status(404).json({ success: false, error: 'Page not found' });
        }
        res.status(200).json({ success: true, data: page });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// GET single page by slug
router.get('/slug/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const page = await Page.findOne({ slug });
        if (!page) {
            return res.status(404).json({ success: false, error: 'Page not found' });
        }
        res.status(200).json({ success: true, data: page });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// POST create new page
router.post('/', async (req, res) => {
    try {
        let pageData = req.body;

        // If creating a Standard Page (not a template), inject global layout
        if (pageData.type === 'page' || !pageData.type) {

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

            // 3. Inject References if no content provided (or even if provided, wrapper is safer, but let's assume empty start)
            if (!pageData.gjsComponents || pageData.gjsComponents.length === 0) {
                pageData.gjsComponents = [
                    {
                        type: 'template-ref',
                        attributes: { id: header._id.toString() }
                    },
                    {
                        tagName: 'div',
                        classes: ['main-content'],
                        style: { 'min-height': '80vh', padding: '20px' },
                        content: 'Start building your page here...'
                    },
                    {
                        type: 'template-ref',
                        attributes: { id: footer._id.toString() }
                    }
                ];
                // Also update HTML for simpler non-editor rendering fallback
                pageData.gjsHtml = `<template-ref id="${header._id}"></template-ref><div class="main-content" style="min-height:80vh; padding:20px;">Start building your page here...</div><template-ref id="${footer._id}"></template-ref>`;
            }
        }

        const page = await Page.create(pageData);
        res.status(201).json({ success: true, data: page });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT update page
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const page = await Page.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!page) {
            return res.status(404).json({ success: false, error: 'Page not found' });
        }
        res.status(200).json({ success: true, data: page });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE page
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPage = await Page.deleteOne({ _id: id });
        if (!deletedPage) {
            return res.status(404).json({ success: false, error: 'Page not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// POST increment view count
router.post('/:id/view', async (req, res) => {
    const { id } = req.params;
    try {
        const page = await Page.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true });
        if (!page) {
            return res.status(404).json({ success: false, error: 'Page not found' });
        }
        res.status(200).json({ success: true, views: page.viewCount });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;
