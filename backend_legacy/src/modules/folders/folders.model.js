const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a folder name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },
    type: {
        type: String,
        enum: ['page', 'template'], // To distinguish if a folder is for pages or templates
        default: 'page'
    }
}, { timestamps: true });

module.exports = mongoose.models.Folder || mongoose.model('Folder', FolderSchema);
