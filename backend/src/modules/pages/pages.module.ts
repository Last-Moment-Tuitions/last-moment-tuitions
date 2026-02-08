import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { Page, PageSchema } from './entities/page.entity';
import { Folder, FolderSchema } from '../folders/entities/folder.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Page.name, schema: PageSchema },
      { name: Folder.name, schema: FolderSchema }
    ])
  ],
  controllers: [PagesController],
  providers: [PagesService],
})
export class PagesModule { }
