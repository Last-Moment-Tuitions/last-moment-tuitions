const foldersService = require('./folders.service');

exports.getFolders = async (req, res) => {
    try {
        const folders = await foldersService.findAll(req.query);
        res.status(200).json({ success: true, data: folders });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getFolderById = async (req, res) => {
    try {
        const folder = await foldersService.findById(req.params.id);
        if (!folder) {
            return res.status(404).json({ success: false, error: 'Folder not found' });
        }
        res.status(200).json({ success: true, data: folder });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.createFolder = async (req, res) => {
    try {
        const folder = await foldersService.create(req.body);
        res.status(201).json({ success: true, data: folder });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteFolder = async (req, res) => {
    try {
        const deleted = await foldersService.delete(req.params.id);
        if (!deleted.deletedCount) {
            return res.status(404).json({ success: false, error: 'Folder not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
