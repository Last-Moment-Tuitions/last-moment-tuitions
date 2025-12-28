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
const page_schema_1 = require("./schemas/page.schema");
let PagesService = class PagesService {
    constructor(pageModel) {
        this.pageModel = pageModel;
    }
    async findAll(filter = {}) {
        if (filter.folder === 'null') {
            filter.folder = null;
        }
        return this.pageModel
            .find(filter)
            .select('title slug updatedAt folder type status viewCount')
            .sort({ updatedAt: -1 })
            .exec();
    }
    async findById(id) {
        return this.pageModel.findById(id).exec();
    }
    async findBySlug(slug) {
        return this.pageModel.findOne({ slug }).exec();
    }
    async create(createPageDto) {
        const createdPage = new this.pageModel(createPageDto);
        return createdPage.save();
    }
    async update(id, updatePageDto) {
        return this.pageModel.findByIdAndUpdate(id, updatePageDto, {
            new: true,
            runValidators: true,
        }).exec();
    }
    async delete(id) {
        return this.pageModel.deleteOne({ _id: id }).exec();
    }
    async incrementView(id) {
        return this.pageModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true }).exec();
    }
};
exports.PagesService = PagesService;
exports.PagesService = PagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(page_schema_1.Page.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PagesService);
//# sourceMappingURL=pages.service.js.map