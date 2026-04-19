import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { S3StorageProvider } from './storage/s3.storage';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/users.module';

export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';

@Module({
    imports: [ConfigModule, AuthModule, UsersModule],
    controllers: [UploadsController],
    providers: [
        {
            provide: STORAGE_PROVIDER,
            useClass: S3StorageProvider,
        },
        UploadsService,
    ],
    exports: [UploadsService],
})
export class UploadsModule { }

