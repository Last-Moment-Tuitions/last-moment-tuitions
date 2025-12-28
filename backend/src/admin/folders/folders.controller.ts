import { Controller, Get, Post, Body, Delete, Param, UseGuards, Query } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { AdminGuard } from '../guards/admin.guard';

import { AuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/folders')
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) { }

    @Get()
    findAll(@Query() query) {
        return this.foldersService.findAll(query);
    }

    @Post()
    create(@Body() createFolderDto: CreateFolderDto) {
        return this.foldersService.create(createFolderDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.foldersService.delete(id);
    }
}
