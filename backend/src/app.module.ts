
import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AdminModule } from './admin/admin.module';
import { PagesModule as PublicPagesModule } from './modules/pages/pages.module';
import { FoldersModule as PublicFoldersModule } from './modules/folders/folders.module';
import { CoursesModule } from './modules/courses/courses.module';
import { MenusModule } from './modules/menus/menus.module';
import { AppLoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    DatabaseModule,
    RedisModule,
    UsersModule,
    AuthModule,
    SupabaseModule,
    AdminModule,
    PublicPagesModule,
    PublicFoldersModule,
    CoursesModule,
    MenusModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Middleware is now global in main.ts
  }
}
