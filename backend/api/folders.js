const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const dbConnect = require('../db/connect');

// Middleware to ensure DB connection
const ensureDb = async (req, res, next) => {
    await dbConnect();
    next();
};

router.use(ensureDb);

// GET folders by parent (or root)
router.get('/', async (req, res) => {
    const { parent, type } = req.query;
    try {
        const query = {
            // If parent is string 'null' or undefined, explicitly query for null
            parent: (parent === 'null' || !parent) ? null : parent
        };

        if (type) query.type = type;

        const folders = await Folder.find(query).sort({ name: 1 });
        res.status(200).json({ success: true, data: folders });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// GET query current folder details (for breadcrumbs)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const folder = await Folder.findById(id).populate('parent');
        if (!folder) {
            return res.status(404).json({ success: false, error: 'Folder not found' });
        }
        res.status(200).json({ success: true, data: folder });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// POST create folder
router.post('/', async (req, res) => {
    try {
        const folder = await Folder.create(req.body);
        res.status(201).json({ success: true, data: folder });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE folder
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Optional: Recursive delete or block if has children?
        // For MVP, just delete the folder. Pages inside might become orphaned or we should update them.
        // Let's just delete the folder for now.
        const deleted = await Folder.deleteOne({ _id: id });
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Folder not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;
