
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
                // Check if data is already in standard format (recursive prevention)
                if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
                    return data;
                }

                // Default values
                let message = 'Request successful';
                let details = data || null;

                // If data is an object with a 'message' property
                if (data && typeof data === 'object' && 'message' in data) {
                    message = data.message;

                    // If the object ONLY has 'message', then details is null
                    if (Object.keys(data).length === 1) {
                        details = null;
                    } else {
                        // Otherwise, details is the data itself (or we could strip message, but usually keeping it is fine/safer)
                        details = data;
                    }
                }

                return {
                    success: true,
                    message: message,
                    details: details,
                };
            }),
        );
    }
}
