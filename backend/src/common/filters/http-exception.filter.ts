
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            success: false,
            message: exception instanceof HttpException ? (exception.getResponse() as any).message || exception.message : 'Internal Server Error',
            details: exception instanceof HttpException ? (exception.getResponse() as any).error || null : null,
        };

        // In production, log the real error safely, but don't return stack traces
        if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
            console.error('CRITICAL INTERNAL ERROR:', exception);
        }

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
