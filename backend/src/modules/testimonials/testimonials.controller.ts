import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Query,
    Param,
    UseGuards
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';

@Controller('testimonials')
export class TestimonialsController {
    constructor(private readonly testimonialsService: TestimonialsService) { }

    @Get()
    async findAll(@Query('target_page') target_page?: string) {
        return this.testimonialsService.findAll(target_page);
    }

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() data: CreateTestimonialDto) {
        return this.testimonialsService.create(data);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() data: Partial<CreateTestimonialDto>,
    ) {
        return this.testimonialsService.update(id, data);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.testimonialsService.delete(id);
    }
}