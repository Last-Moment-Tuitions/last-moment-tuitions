import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { AdminGuard } from '../guards/admin.guard';

import { AuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService) { }

    @Get()
    findAll(@Query() query) {
        return this.pagesService.findAll(query);
    }

    @Get('id/:id')
    findById(@Param('id') id: string) {
        return this.pagesService.findById(id);
    }

    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.pagesService.findBySlug(slug);
    }

    @Post()
    create(@Body() createPageDto: CreatePageDto) {
        return this.pagesService.create(createPageDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
        return this.pagesService.update(id, updatePageDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.pagesService.delete(id);
    }

    @Post(':id/view')
    incrementView(@Param('id') id: string) {
        return this.pagesService.incrementView(id);
    }
}
