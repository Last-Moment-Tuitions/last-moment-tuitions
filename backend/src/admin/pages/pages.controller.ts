import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseGuards,
    Query,
    Logger,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/pages')
export class PagesController {
    private readonly logger = new Logger(PagesController.name);

    constructor(private readonly pagesService: PagesService) { }

    @Get()
    async findAll(@Query() query) {
        try {
            this.logger.log(`Finding all pages with query: ${JSON.stringify(query)}`);
            const pages = await this.pagesService.findAll(query);
            this.logger.log(`Found ${pages.length} pages`);
            return pages;
        } catch (error) {
            this.logger.error(`Error finding pages: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve pages. Please try again later.');
        }
    }

    @Get('id/:id')
    async findById(@Param('id') id: string) {
        try {
            this.logger.log(`Finding page by ID: ${id}`);

            if (!id || id === 'undefined' || id === 'null') {
                throw new BadRequestException('Invalid page ID provided');
            }

            const page = await this.pagesService.findById(id);

            if (!page) {
                this.logger.warn(`Page not found with ID: ${id}`);
                throw new NotFoundException(`Page with ID "${id}" not found`);
            }

            this.logger.log(`Successfully found page: ${page.title}`);
            return page;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error finding page by ID ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve page. Please try again later.');
        }
    }

    @Get('slug/:slug')
    async findBySlug(@Param('slug') slug: string) {
        try {
            this.logger.log(`Finding page by slug: ${slug}`);

            if (!slug || slug === 'undefined' || slug === 'null') {
                throw new BadRequestException('Invalid page slug provided');
            }

            const page = await this.pagesService.findBySlug(slug);

            if (!page) {
                this.logger.warn(`Page not found with slug: ${slug}`);
                throw new NotFoundException(`Page with slug "${slug}" not found`);
            }

            this.logger.log(`Successfully found page: ${page.title}`);
            return page;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error finding page by slug ${slug}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve page. Please try again later.');
        }
    }

    @Post()
    async create(@Body() createPageDto: CreatePageDto) {
        try {
            this.logger.log(`Creating new page: ${createPageDto.title}`);
            const page = await this.pagesService.create(createPageDto);
            this.logger.log(`Successfully created page with ID: ${page._id}`);
            return page;
        } catch (error) {
            this.logger.error(`Error creating page: ${error.message}`, error.stack);

            if (error.code === 11000) {
                throw new BadRequestException('A page with this slug already exists');
            }

            if (error.name === 'ValidationError') {
                throw new BadRequestException(`Validation failed: ${error.message}`);
            }

            throw new InternalServerErrorException('Failed to create page. Please try again later.');
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
        try {
            this.logger.log(`Updating page with ID: ${id}`);

            if (!id || id === 'undefined' || id === 'null') {
                throw new BadRequestException('Invalid page ID provided');
            }

            const page = await this.pagesService.update(id, updatePageDto);

            if (!page) {
                this.logger.warn(`Page not found for update with ID: ${id}`);
                throw new NotFoundException(`Page with ID "${id}" not found`);
            }

            this.logger.log(`Successfully updated page: ${page.title}`);
            return page;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            this.logger.error(`Error updating page ${id}: ${error.message}`, error.stack);

            if (error.code === 11000) {
                throw new BadRequestException('A page with this slug already exists');
            }

            if (error.name === 'ValidationError') {
                throw new BadRequestException(`Validation failed: ${error.message}`);
            }

            throw new InternalServerErrorException('Failed to update page. Please try again later.');
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            this.logger.log(`Deleting page with ID: ${id}`);

            if (!id || id === 'undefined' || id === 'null') {
                throw new BadRequestException('Invalid page ID provided');
            }

            const result = await this.pagesService.delete(id);

            if (result.deletedCount === 0) {
                this.logger.warn(`Page not found for deletion with ID: ${id}`);
                throw new NotFoundException(`Page with ID "${id}" not found`);
            }

            this.logger.log(`Successfully deleted page with ID: ${id}`);
            return { message: 'Page deleted successfully', id };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error deleting page ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to delete page. Please try again later.');
        }
    }

    @Post(':id/view')
    async incrementView(@Param('id') id: string) {
        try {
            this.logger.log(`Incrementing view count for page ID: ${id}`);

            if (!id || id === 'undefined' || id === 'null') {
                throw new BadRequestException('Invalid page ID provided');
            }

            const page = await this.pagesService.incrementView(id);

            if (!page) {
                this.logger.warn(`Page not found for view increment with ID: ${id}`);
                throw new NotFoundException(`Page with ID "${id}" not found`);
            }

            this.logger.log(`Successfully incremented view count for page: ${page.title}`);
            return page;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error incrementing view for page ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to increment page view. Please try again later.');
        }
    }
}
