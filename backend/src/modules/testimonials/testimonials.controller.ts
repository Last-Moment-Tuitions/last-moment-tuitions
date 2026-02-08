import { Controller, Get, Post, Patch, Delete, Body, Query, Param } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';

@Controller('testimonials')
export class TestimonialsController {
    constructor(private readonly testimonialsService: TestimonialsService) { }

    @Get()
    async getForPage(@Query('page') page: string) {
        return this.testimonialsService.findByPage(page || 'Homepage');
    }

    @Post()
    async create(@Body() data: any) {
        return this.testimonialsService.create(data);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        return this.testimonialsService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.testimonialsService.delete(id);
    }
}