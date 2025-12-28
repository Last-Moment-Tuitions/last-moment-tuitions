
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        const session = await this.authService.validateSession(token);
        if (!session) {
            throw new UnauthorizedException('Invalid or expired session');
        }

        // Attach user/session to request
        request['user'] = {
            userId: session.userId,
            sessionId: token,
            provider: session.authProvider
        };

        return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {
        // 1. Check for explicit Session ID header (User Preference)
        const sessionId = request.headers['x-session-id'];
        if (sessionId) return sessionId;

        // 2. Fallback to Bearer token (Standard)
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
