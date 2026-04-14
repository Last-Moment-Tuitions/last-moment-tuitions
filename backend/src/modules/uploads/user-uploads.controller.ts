import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { AuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('uploads')
export class UserUploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @Post('presigned-url')
    @HttpCode(HttpStatus.OK)
    async getPresignedUrl(
        @Body() body: { filename: string; contentType: string; category: 'image' | 'video' | 'document'; size: number }
    ) {
        const { filename, contentType, category, size } = body;
        // In reality, might want to restrict category or size here
        const result = await this.uploadsService.requestPresignedUrl(filename, contentType, category, size);
        return { success: true, data: result };
    }
}
