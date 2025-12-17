import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  async create(@Body() createPageDto: CreatePageDto) {
    const page = await this.pagesService.create(createPageDto);
    return { success: true, data: page };
  }

  @Get()
  async findAll(@Query() query: any) {
    const pages = await this.pagesService.findAll(query);
    return { success: true, data: pages };
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const page = await this.pagesService.findBySlug(slug);
    if (!page) throw new NotFoundException('Page not found');
    return { success: true, data: page };
  }

  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    const page = await this.pagesService.findOne(id);
    if (!page) throw new NotFoundException('Page not found');
    return { success: true, data: page };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    const page = await this.pagesService.update(id, updatePageDto);
    if (!page) throw new NotFoundException('Page not found');
    return { success: true, data: page };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.pagesService.remove(id);
    if (result.deletedCount === 0) throw new NotFoundException('Page not found');
    return { success: true, data: {} };
  }

  @Patch(':id/view')
  async incrementView(@Param('id') id: string) {
    const page = await this.pagesService.incrementView(id);
    if (!page) throw new NotFoundException('Page not found');
    return { success: true, views: page.viewCount };
  }
}
