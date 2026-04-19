import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

// Cached after first cold start — reused across Vercel invocations
let cachedHandler: ((req: any, res: any) => void) | null = null;

async function bootstrap(): Promise<(req: any, res: any) => void> {
    if (cachedHandler) return cachedHandler;

    // NestJS creates its own Express instance internally — no direct express import needed
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['error', 'warn'],
    });

    const configService = app.get(ConfigService);

    app.use(helmet());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    app.setGlobalPrefix('api');

    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (
                origin.startsWith('http://localhost:') ||
                origin.startsWith('http://127.0.0.1:')
            ) {
                return callback(null, true);
            }

            const frontendUrls = configService.get<string>('FRONTEND_URL') || '';
            const allowedOrigins = frontendUrls
                .split(',')
                .map((url: string) => url.trim().replace(/\/$/, ''))
                .filter(Boolean);
            const normalizedOrigin = origin.replace(/\/$/, '');

            const isDomainMatch =
                normalizedOrigin === 'https://lastmomenttuitions.com' ||
                normalizedOrigin.endsWith('.lastmomenttuitions.com');

            if (allowedOrigins.includes(normalizedOrigin) || isDomainMatch) {
                return callback(null, true);
            }

            callback(new Error(`Not allowed by CORS: ${normalizedOrigin}`));
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Session-Id',
            'X-SESSION-ID',
            'X-CSRF-Token',
            'X-Requested-With',
            'Accept',
            'Accept-Version',
            'Content-Length',
            'Content-MD5',
            'Date',
            'X-Api-Version',
        ],
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalInterceptors(new TransformInterceptor());
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    await app.init();

    // Pull the underlying Express instance NestJS created — this IS callable as a handler
    cachedHandler = app.getHttpAdapter().getInstance();
    return cachedHandler;
}

export default async function handler(req: any, res: any) {
    const app = await bootstrap();
    app(req, res);
}
