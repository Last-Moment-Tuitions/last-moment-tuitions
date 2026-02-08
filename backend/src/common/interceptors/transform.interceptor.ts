
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
                // If data is already in the correct format, return it as is
                if (data && typeof data === 'object' && 'success' in data && typeof data.success === 'boolean') {
                    return data;
                }

                // Default values
                let message = 'Request successful';
                let details = data; // Default details is the raw data
                let success = true; // Assume success for normal responses

                // If data is an object with a 'message' property, extract it
                if (data && typeof data === 'object' && !Array.isArray(data)) {
                    if ('message' in data) {
                        message = data.message;
                        // If data only contained 'message', details should be null
                        // Otherwise, details can be the rest of the object or null if desired
                        const keys = Object.keys(data);
                        if (keys.length === 1 && keys[0] === 'message') {
                            details = null;
                        } else {
                            details = data;
                        }
                    }
                }

                return {
                    success,
                    message,
                    details,
                };
            }),
        );
    }
}
