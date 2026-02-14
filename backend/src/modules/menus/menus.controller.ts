import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  async create(@Body() createMenuDto: CreateMenuDto) {
    const menu = await this.menusService.create(createMenuDto);
    return { success: true, data: menu };
  }

  @Get()
  async findAll() {
    const menus = await this.menusService.findAll();
    return { success: true, data: menus };
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    const menu = await this.menusService.findByName(name);
    if (!menu) {
        throw new NotFoundException(`Menu '${name}' not found`);
    }
    return { success: true, data: menu };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const menu = await this.menusService.findOne(id);
    return { success: true, data: menu };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    const menu = await this.menusService.update(id, updateMenuDto);
    return { success: true, data: menu };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.menusService.remove(id);
    return { success: true, data: {} };
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    const menu = await this.menusService.activate(id);
    return { success: true, data: menu };
  }

  @Get('status/active')
  async findActive() {
    const menu = await this.menusService.findActive();
    return { success: true, data: menu };
  }
}
