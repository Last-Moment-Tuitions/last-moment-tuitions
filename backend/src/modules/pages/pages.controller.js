const pagesService = require('./pages.service');

exports.getPages = async (req, res) => {
    try {
        const pages = await pagesService.findAll(req.query);
        res.status(200).json({ success: true, data: pages });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getPageById = async (req, res) => {
    try {
        const page = await pagesService.findById(req.params.id);
        if (!page) {
            return res.status(404).json({ success: false, error: 'Page not found' });
        }
        res.status(200).json({ success: true, data: page });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getPageBySlug = async (req, res) => {
    try {
        const page = await pagesService.findBySlug(req.params.slug);
        if (!page) {
            return res.status(404).json({ success: false, error: 'Page not found' });
        }
        res.status(200).json({ success: true, data: page });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.createPage = async (req, res) => {
    try {
        const page = await pagesService.create(req.body);
        res.status(201).json({ success: true, data: page });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updatePage = async (req, res) => {
    try {
        const page = await pagesService.update(req.params.id, req.body);
        if (!page) {
            return res.status(404).json({ success: false, error: 'Page not found' });
        }
        res.status(200).json({ success: true, data: page });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deletePage = async (req, res) => {
    try {
        const deleted = await pagesService.delete(req.params.id);
        if (!deleted.deletedCount) {
            return res.status(404).json({ success: false, error: 'Page not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.incrementView = async (req, res) => {
    try {
        const page = await pagesService.incrementView(req.params.id);
        if (!page) {
            return res.status(404).json({ success: false, error: 'Page not found' });
        }
        res.status(200).json({ success: true, views: page.viewCount });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
