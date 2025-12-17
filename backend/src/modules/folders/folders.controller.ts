import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  async create(@Body() createFolderDto: CreateFolderDto) {
    const folder = await this.foldersService.create(createFolderDto);
    return { success: true, data: folder };
  }

  @Get()
  async findAll(@Query() query: any) {
    const folders = await this.foldersService.findAll(query);
    return { success: true, data: folders };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const folder = await this.foldersService.findOne(id);
    if (!folder) throw new NotFoundException('Folder not found');
    return { success: true, data: folder };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
    const folder = await this.foldersService.update(id, updateFolderDto);
    if (!folder) throw new NotFoundException('Folder not found');
    return { success: true, data: folder };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.foldersService.remove(id);
    if (result.deletedCount === 0) throw new NotFoundException('Folder not found');
    return { success: true, data: {} };
  }
}
