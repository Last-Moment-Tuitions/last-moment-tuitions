
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
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            message: exception instanceof HttpException
                ? (typeof exception.getResponse() === 'object' ? (exception.getResponse() as any).message : exception.message)
                : 'Internal Server Error',
        };

        // In production, log the real error safely, but don't return stack traces
        if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
            console.error('CRITICAL INTERNAL ERROR:', exception);
        }

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
