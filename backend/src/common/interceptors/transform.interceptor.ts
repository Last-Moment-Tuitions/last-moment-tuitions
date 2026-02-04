
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    success: boolean;
    message: string;
    details: T;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => {
                // If the data already has a specific structure or is null/undefined
                const message = data?.message || 'Request successful';
                const details = data?.details !== undefined ? data.details : (data?.message ? (Object.keys(data).length > 1 ? data : null) : data);

                // Special handling to avoid nesting if data is already in the format
                if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
                    return data;
                }

                return {
                    success: true,
                    message: message,
                    details: data?.message && Object.keys(data).length === 1 ? null : (data || null),
                };
            }),
        );
    }
}
