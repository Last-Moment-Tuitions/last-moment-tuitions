import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  async create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get()
  async findAll() {
    return this.menusService.findAll();
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    const menu = await this.menusService.findByName(name);
    if (!menu) {
        throw new NotFoundException(`Menu '${name}' not found`);
    }
    return menu;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.menusService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(id, updateMenuDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    return this.menusService.activate(id);
  }

  @Get('status/active')
  async findActive() {
    return this.menusService.findActive();
  }
}
