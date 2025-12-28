import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder } from './schemas/folder.schema';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FoldersService {
    constructor(
        @InjectModel(Folder.name) private folderModel: Model<Folder>,
    ) { }

    async findAll(filter: any = {}) {
        if (filter.parent === 'null') {
            filter.parent = null;
        }
        return this.folderModel.find(filter).exec();
    }

    async create(createFolderDto: CreateFolderDto) {
        const createdFolder = new this.folderModel(createFolderDto);
        return createdFolder.save();
    }

    async delete(id: string) {
        // Optional: check if folder is empty or delete recursively
        return this.folderModel.deleteOne({ _id: id }).exec();
    }
}
