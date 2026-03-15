import {
    Controller,
    Post,
    Delete,
    Get,
    Query,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AdminGuard } from '../../admin/guards/admin.guard';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @Post('presigned-url')
    async getPresignedUrl(
        @Body() body: { filename: string; contentType: string; category: 'image' | 'video' | 'document'; size: number }
    ) {
        const { filename, contentType, category, size } = body;
        const result = await this.uploadsService.requestPresignedUrl(filename, contentType, category, size);
        return { success: true, data: result };
    }

    @Delete(':key(*)')
    async deleteFile(@Param('key') key: string) {
        await this.uploadsService.deleteFile(key);
        return { success: true, message: 'File deleted successfully' };
    }

    @Get('media')
    async listMedia(@Query('type') type?: string) {
        const result = await this.uploadsService.listMedia(type);
        return { success: true, data: result };
    }
}
