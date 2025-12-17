const Folder = require('./folders.model');

class FoldersService {
    async findAll(queryObj) {
        const { parent, type } = queryObj;
        const query = {
            parent: (parent === 'null' || !parent) ? null : parent
        };
        if (type) query.type = type;

        return await Folder.find(query).sort({ name: 1 });
    }

    async findById(id) {
        return await Folder.findById(id).populate('parent');
    }

    async create(data) {
        return await Folder.create(data);
    }

    async delete(id) {
        return await Folder.deleteOne({ _id: id });
    }
}

module.exports = new FoldersService();
