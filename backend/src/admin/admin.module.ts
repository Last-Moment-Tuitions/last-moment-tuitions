import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { PagesService } from './pages/pages.service';
import { PagesController } from './pages/pages.controller';
import { Page, PageSchema } from './pages/schemas/page.schema';
import { FoldersService } from './folders/folders.service';
import { FoldersController } from './folders/folders.controller';
import { Folder, FolderSchema } from './folders/schemas/folder.schema';
import { AdminGuard } from './guards/admin.guard';
import { AuthModule } from '../auth/auth.module'; // Needed if AuthGuard is used globally or we need AuthService

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Page.name, schema: PageSchema },
            { name: Folder.name, schema: FolderSchema },
        ]),
        UsersModule,
        AuthModule, // Importing AuthModule to ensure AuthGuard dependencies are met if needed
    ],
    controllers: [PagesController, FoldersController],
    providers: [PagesService, FoldersService, AdminGuard],
    exports: [AdminGuard], // Exporting AdminGuard if used effectively elsewhere, though mainly used in this module's controllers
})
export class AdminModule { }
