import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UserUploadsController } from './user-uploads.controller';
import { UploadsService } from './uploads.service';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/users.module';

@Module({
    imports: [AuthModule, UsersModule],
    controllers: [UploadsController, UserUploadsController],
    providers: [UploadsService],
    exports: [UploadsService],
})
export class UploadsModule { }
