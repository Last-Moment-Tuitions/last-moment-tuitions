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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageSchema = exports.Page = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Page = class Page extends mongoose_2.Document {
};
exports.Page = Page;
__decorate([
    (0, mongoose_1.Prop)({ required: true, maxlength: 60 }),
    __metadata("design:type", String)
], Page.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true }),
    __metadata("design:type", String)
], Page.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ maxlength: 160 }),
    __metadata("design:type", String)
], Page.prototype, "metaDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], Page.prototype, "gjsComponents", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], Page.prototype, "gjsStyles", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Page.prototype, "gjsHtml", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Page.prototype, "gjsCss", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['page', 'template'], default: 'page' }),
    __metadata("design:type", String)
], Page.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['draft', 'published', 'archived'], default: 'draft' }),
    __metadata("design:type", String)
], Page.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Page.prototype, "viewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Folder', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Page.prototype, "folder", void 0);
exports.Page = Page = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Page);
exports.PageSchema = mongoose_1.SchemaFactory.createForClass(Page);
//# sourceMappingURL=page.schema.js.map