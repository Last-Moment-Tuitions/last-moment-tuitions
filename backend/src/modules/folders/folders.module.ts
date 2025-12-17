import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { Folder, FolderSchema } from './entities/folder.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }])],
  controllers: [FoldersController],
  providers: [FoldersService],
})
export class FoldersModule {}
