import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { StorageProvider } from './storage.interface';

@Injectable()
export class S3StorageProvider implements StorageProvider {
    private readonly s3Client: S3Client;
    private readonly bucket: string;
    private readonly region: string;
    private readonly logger = new Logger(S3StorageProvider.name);

    constructor() {
        this.region = process.env.AWS_REGION || 'ap-south-1';
        this.bucket = process.env.AWS_S3_BUCKET || '';

        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
    }

    async getPresignedUrl(
        folder: string,
        filename: string,
        contentType: string
    ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
        if (!process.env.AWS_S3_BUCKET || !process.env.AWS_ACCESS_KEY_ID) {
            throw new Error('AWS credentials (AWS_S3_BUCKET or AWS_ACCESS_KEY_ID) are missing from backend environment variables. Please configure S3 in your .env file.');
        }

        const ext = path.extname(filename);
        const uniqueFilename = `${uuidv4()}${ext}`;
        const key = `${folder}/${uniqueFilename}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
        });

        try {
            // URL expires in 15 minutes
            const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
            const publicUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

            return { uploadUrl, key, publicUrl };
        } catch (error: any) {
            this.logger.error(`Failed to generate presigned URL: ${error.message}`);
            throw error;
        }
    }

    async upload(
        file: Express.Multer.File,
        folder: string,
    ): Promise<{ url: string; key: string }> {
        throw new Error('Direct upload via backend is disabled. Use getPresignedUrl instead.');
    }

    async delete(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        try {
            await this.s3Client.send(command);
        } catch (error: any) {
            this.logger.error(`Failed to delete from S3: ${error.message}`);
            throw error;
        }
    }

    async list(folder?: string): Promise<Array<{ url: string; key: string; lastModified: Date; size: number }>> {
        const command = new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: folder ? `${folder}/` : undefined,
        });

        try {
            const response = await this.s3Client.send(command);
            if (!response.Contents) return [];

            return response.Contents.map((item) => ({
                key: item.Key || '',
                url: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${item.Key}`,
                lastModified: item.LastModified || new Date(),
                size: item.Size || 0,
            })).sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
        } catch (error: any) {
            this.logger.error(`Failed to list objects from S3: ${error.message}`);
            throw error;
        }
    }
}
