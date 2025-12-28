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
exports.FoldersController = void 0;
const common_1 = require("@nestjs/common");
const folders_service_1 = require("./folders.service");
const create_folder_dto_1 = require("./dto/create-folder.dto");
const admin_guard_1 = require("../guards/admin.guard");
const auth_guard_1 = require("../../auth/guards/auth.guard");
let FoldersController = class FoldersController {
    constructor(foldersService) {
        this.foldersService = foldersService;
    }
    findAll(query) {
        return this.foldersService.findAll(query);
    }
    create(createFolderDto) {
        return this.foldersService.create(createFolderDto);
    }
    delete(id) {
        return this.foldersService.delete(id);
    }
};
exports.FoldersController = FoldersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_folder_dto_1.CreateFolderDto]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FoldersController.prototype, "delete", null);
exports.FoldersController = FoldersController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Controller)('admin/folders'),
    __metadata("design:paramtypes", [folders_service_1.FoldersService])
], FoldersController);
//# sourceMappingURL=folders.controller.js.map