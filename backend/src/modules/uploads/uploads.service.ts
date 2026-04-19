import { Injectable, BadRequestException, Logger, Inject } from '@nestjs/common';
import { StorageProvider } from './storage/storage.interface';
import { STORAGE_PROVIDER } from './constants';

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
        image: 10 * 1024 * 1024,   // 10 MB
        video: 500 * 1024 * 1024,  // 500 MB
        document: 50 * 1024 * 1024, // 50 MB
    };

    // Maps category name to S3 folder prefix — single source of truth
    private readonly folderMap: Record<string, string> = {
        image: 'images',
        video: 'videos',
        document: 'documents',
    };

    constructor(@Inject(STORAGE_PROVIDER) storage: StorageProvider) {
        this.storage = storage;
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
        const folder = this.folderMap[category] || 'misc';

        return this.storage.getPresignedUrl(folder, filename, contentType);
    }

    async deleteFile(key: string): Promise<void> {
        return this.storage.delete(key);
    }

    async listMedia(type?: string): Promise<any[]> {
        const folder = type ? this.folderMap[type] : undefined;
        return this.storage.list(folder);
    }

    async getFileBuffer(key: string): Promise<Buffer> {
        if (!this.storage.getBuffer) {
            throw new Error('Storage provider does not support getBuffer');
        }
        return this.storage.getBuffer(key);
    }
}
