
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthGuard } from './guards/auth.guard';

import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from '../modules/courses/entities/enrollment.entity';

@Module({
    imports: [
        UsersModule,
        FirebaseModule,
        MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }])
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard],
    exports: [AuthService, AuthGuard],
})
export class AuthModule { }
