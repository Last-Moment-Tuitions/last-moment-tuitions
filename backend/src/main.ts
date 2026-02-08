
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
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

    // Increase body size limit for large GrapesJS payloads
    app.use(json({ limit: '1mb' }));
    app.use(urlencoded({ extended: true, limit: '1mb' }));

    // Global Prefix
    app.setGlobalPrefix('api');

    // CORS - Allow all localhost origins for development
    app.enableCors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl, Postman)
            if (!origin) return callback(null, true);

            // Allow all localhost origins
            if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
                return callback(null, true);
            }

            // Production: use env variable
            const allowedOrigins = [configService.get<string>('FRONTEND_URL')].filter(Boolean);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            callback(new Error('Not allowed by CORS'));
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Session-Id',
            'X-Requested-With',
            'Accept',
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
