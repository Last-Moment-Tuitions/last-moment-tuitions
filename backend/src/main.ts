
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { functionalLogger } from './common/middleware/logger.middleware';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());
    const configService = app.get(ConfigService);

    // Security Headers
    app.use(helmet());

    app.use(functionalLogger);

    // Global Prefix
    app.setGlobalPrefix('api');


    console.log(configService.get<string>('FRONTEND_URL'), 'frontend url');
    // CORS
    app.enableCors({
        origin: [configService.get<string>('FRONTEND_URL'), 'https://last-moment-tuitions-frontend.vercel.app', 'https://last-moment-tuitions-frontend.vercel.app/'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Session-Id',
        ],
        credentials: true,
    });

    // Global Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    const port = configService.get<number>('PORT') || 3005;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
