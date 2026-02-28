
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
    imports: [UsersModule, FirebaseModule],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard],
    exports: [AuthService, AuthGuard],
})
export class AuthModule { }
