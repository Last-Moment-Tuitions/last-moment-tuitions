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
exports.FoldersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const folder_entity_1 = require("./entities/folder.entity");
let FoldersService = class FoldersService {
    folderModel;
    constructor(folderModel) {
        this.folderModel = folderModel;
    }
    async create(createFolderDto) {
        const createdFolder = new this.folderModel(createFolderDto);
        return createdFolder.save();
    }
    async findAll(query) {
        const { parent, type } = query;
        const filter = {
            parent: (parent === 'null' || !parent) ? null : parent
        };
        if (type)
            filter.type = type;
        return this.folderModel.find(filter).sort({ name: 1 }).exec();
    }
    async findOne(id) {
        return this.folderModel.findById(id).populate('parent').exec();
    }
    async update(id, updateFolderDto) {
        return this.folderModel.findByIdAndUpdate(id, updateFolderDto, { new: true }).exec();
    }
    async remove(id) {
        return this.folderModel.deleteOne({ _id: id }).exec();
    }
};
exports.FoldersService = FoldersService;
exports.FoldersService = FoldersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(folder_entity_1.Folder.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FoldersService);
//# sourceMappingURL=folders.service.js.map