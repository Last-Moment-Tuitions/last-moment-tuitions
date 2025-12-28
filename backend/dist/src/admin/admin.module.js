"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_module_1 = require("../users/users.module");
const pages_service_1 = require("./pages/pages.service");
const pages_controller_1 = require("./pages/pages.controller");
const page_schema_1 = require("./pages/schemas/page.schema");
const folders_service_1 = require("./folders/folders.service");
const folders_controller_1 = require("./folders/folders.controller");
const folder_schema_1 = require("./folders/schemas/folder.schema");
const admin_guard_1 = require("./guards/admin.guard");
const auth_module_1 = require("../auth/auth.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: page_schema_1.Page.name, schema: page_schema_1.PageSchema },
                { name: folder_schema_1.Folder.name, schema: folder_schema_1.FolderSchema },
            ]),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
        ],
        controllers: [pages_controller_1.PagesController, folders_controller_1.FoldersController],
        providers: [pages_service_1.PagesService, folders_service_1.FoldersService, admin_guard_1.AdminGuard],
        exports: [admin_guard_1.AdminGuard],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map