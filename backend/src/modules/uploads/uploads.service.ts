import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { StorageProvider } from './storage/storage.interface';
import { S3StorageProvider } from './storage/s3.storage';

@Injectable()
export class UploadsService {
    private readonly storage: StorageProvider;
    private readonly logger = new Logger(UploadsService.name);

    // Allowed MIME types per category
    private readonly allowedTypes = {
        image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
        video: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
        document: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
        ],
    };

    // Max sizes per category (in bytes)
    private readonly maxSizes = {
        image: 10 * 1024 * 1024, // 10 MB
        video: 500 * 1024 * 1024, // 500 MB
        document: 50 * 1024 * 1024, // 50 MB
    };

    constructor() {
        this.logger.log(`Using S3 storage provider exclusively`);
        this.storage = new S3StorageProvider();
    }

    async requestPresignedUrl(
        filename: string,
        contentType: string,
        category: 'image' | 'video' | 'document',
        size: number
    ): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
        // Validate MIME type
        const allowed = this.allowedTypes[category] || [];
        if (!allowed.includes(contentType)) {
            throw new BadRequestException(
                `Invalid file type "${contentType}" for category "${category}". Allowed: ${allowed.join(', ')}`,
            );
        }

        // Validate file size
        const maxSize = this.maxSizes[category] || 10 * 1024 * 1024;
        if (size > maxSize) {
            const maxMB = Math.round(maxSize / (1024 * 1024));
            throw new BadRequestException(
                `File size ${Math.round(size / (1024 * 1024))}MB exceeds maximum ${maxMB}MB for ${category}`,
            );
        }

        // Map category to storage folder
        const folderMap = {
            image: 'images',
            video: 'videos',
            document: 'documents',
        };
        const folder = folderMap[category] || 'misc';

        return this.storage.getPresignedUrl(folder, filename, contentType);
    }

    async deleteFile(key: string): Promise<void> {
        return this.storage.delete(key);
    }

    async listMedia(type?: string): Promise<any[]> {
        const folderMap: Record<string, string> = {
            image: 'images',
            video: 'videos',
            document: 'documents',
        };
        const folder = type ? folderMap[type] : undefined;
        return this.storage.list(folder);
    }
}
