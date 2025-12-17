"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const page_entity_1 = require("./entities/page.entity");
let PagesService = class PagesService {
    pageModel;
    constructor(pageModel) {
        this.pageModel = pageModel;
    }
    async create(createPageDto) {
        const pageData = { ...createPageDto };
        if (pageData.type === 'page' || !pageData.type) {
            const headerId = await this._getOrCreateTemplate('global-header', 'Global Header', '<div style="background:#fff; padding:15px; border-bottom:1px solid #ddd; position:sticky; top:0; z-index:50;"><strong>LOGO</strong> <a href="/">Home</a></div>', [{ tagName: 'div', style: { position: 'sticky', top: '0', 'z-index': '50', background: 'white', padding: '15px' }, content: '<strong>LOGO</strong> <a href="/">Home</a>' }]);
            const footerId = await this._getOrCreateTemplate('global-footer', 'Global Footer', '<div style="background:#111; color:#fff; padding:20px; text-align:center;">&copy; 2025 Last Moment Tuitions</div>', [{ tagName: 'div', style: { background: '#111', color: '#fff', padding: '30px', 'text-align': 'center' }, content: '&copy; 2025 Last Moment Tuitions' }]);
            if (!pageData.gjsComponents || pageData.gjsComponents.length === 0) {
                pageData.gjsComponents = [
                    { type: 'template-ref', attributes: { id: headerId.toString() } },
                    { tagName: 'div', classes: ['main-content'], style: { 'min-height': '80vh', padding: '20px' }, content: 'Start building your page here...' },
                    { type: 'template-ref', attributes: { id: footerId.toString() } }
                ];
                pageData.gjsHtml = `<template-ref id="${headerId}"></template-ref><div class="main-content" style="min-height:80vh; padding:20px;">Start building your page here...</div><template-ref id="${footerId}"></template-ref>`;
            }
        }
        const createdPage = new this.pageModel(pageData);
        return createdPage.save();
    }
    async findAll(query) {
        const { folder, type } = query;
        const filter = {};
        if (folder !== undefined) {
            filter.folder = (folder === 'null' || !folder) ? null : folder;
        }
        if (type)
            filter.type = type;
        return this.pageModel.find(filter)
            .select('title slug updatedAt folder type status viewCount')
            .sort({ updatedAt: -1 })
            .exec();
    }
    async findOne(id) {
        return this.pageModel.findById(id).exec();
    }
    async findBySlug(slug) {
        return this.pageModel.findOne({ slug }).exec();
    }
    async update(id, updatePageDto) {
        return this.pageModel.findByIdAndUpdate(id, updatePageDto, { new: true, runValidators: true }).exec();
    }
    async remove(id) {
        return this.pageModel.deleteOne({ _id: id }).exec();
    }
    async incrementView(id) {
        return this.pageModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true }).exec();
    }
    async _getOrCreateTemplate(slug, title, html, components) {
        let template = await this.pageModel.findOne({ slug, type: 'template' }).exec();
        if (!template) {
            template = await new this.pageModel({
                title,
                slug,
                type: 'template',
                gjsHtml: html,
                gjsCss: '',
                gjsComponents: components
            }).save();
        }
        return template._id;
    }
};
exports.PagesService = PagesService;
exports.PagesService = PagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(page_entity_1.Page.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PagesService);
//# sourceMappingURL=pages.service.js.map