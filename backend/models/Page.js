const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this page.'],
        maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    slug: {
        type: String,
        required: [true, 'Please provide a slug for this page.'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    metaDescription: {
        type: String,
        maxlength: [160, 'Description cannot be more than 160 characters'],
    },
    // Flexible content blocks (Legacy or simplified)
    content: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
    },
    // GrapesJS Storage
    // GrapesJS Storage
    gjsAssets: { type: [mongoose.Schema.Types.Mixed], default: [] },
    type: { type: String, enum: ['page', 'template'], default: 'page' },
    createdAt: { type: Date, default: Date.now },
    gjsComponents: { type: [mongoose.Schema.Types.Mixed], default: [] }, // JSON for editor reload
    gjsStyles: { type: [mongoose.Schema.Types.Mixed], default: [] },

    // CMS Features
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    viewCount: { type: Number, default: 0 },
    publishedAt: { type: Date },

    // Organization
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },

    gjsCss: { type: String, default: '' },
    gjsHtml: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.models.Page || mongoose.model('Page', PageSchema);
