import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu, MenuDocument } from './entities/menu.entity';

@Injectable()
export class MenusService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

  async create(createMenuDto: CreateMenuDto) {
    const createdMenu = new this.menuModel(createMenuDto);
    return createdMenu.save();
  }

  async findAll() {
    return this.menuModel.find().exec();
  }

  async findByName(name: string) {
    return this.menuModel.findOne({ name }).exec();
  }

  async findOne(id: string) {
    const menu = await this.menuModel.findById(id).exec();
    if (!menu) {
        throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const existingMenu = await this.menuModel
      .findByIdAndUpdate(id, updateMenuDto, { new: true })
      .exec();
      
    if (!existingMenu) {
        throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return existingMenu;
  }

  async remove(id: string) {
    const result = await this.menuModel.findByIdAndDelete(id).exec();
    if (!result) {
         throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return result;
  }

  async activate(id: string) {
    // 1. Deactivate all
    await this.menuModel.updateMany({}, { isActive: false }).exec();
    
    // 2. Activate specific one
    const menu = await this.menuModel.findByIdAndUpdate(id, { isActive: true }, { new: true }).exec();
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  async findActive() {
    return this.menuModel.findOne({ isActive: true }).exec();
  }
}
