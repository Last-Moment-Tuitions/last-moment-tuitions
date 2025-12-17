import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Folder, FolderDocument } from './entities/folder.entity';

@Injectable()
export class FoldersService {
  constructor(@InjectModel(Folder.name) private folderModel: Model<FolderDocument>) {}

  async create(createFolderDto: CreateFolderDto) {
    const createdFolder = new this.folderModel(createFolderDto);
    return createdFolder.save();
  }

  async findAll(query: any) {
    const { parent, type } = query;
    const filter: any = {
      parent: (parent === 'null' || !parent) ? null : parent
    };
    if (type) filter.type = type;
    
    return this.folderModel.find(filter).sort({ name: 1 }).exec();
  }

  async findOne(id: string) {
    return this.folderModel.findById(id).populate('parent').exec();
  }

  async update(id: string, updateFolderDto: UpdateFolderDto) {
    return this.folderModel.findByIdAndUpdate(id, updateFolderDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.folderModel.deleteOne({ _id: id }).exec();
  }
}
