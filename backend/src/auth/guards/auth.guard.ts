import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }

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

        // Retrieve full user for role check
        const user = await this.usersService.findByIdPublic(session.userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        
        if (request.url.includes('/admin')) {
            console.log(`[AuthGuard] Checking Admin Access: URL=${request.url}, Roles=${user.roles}`);
            if (!user.roles || !user.roles.includes('admin')) {
                console.warn(`[AuthGuard] Access Denied for ${user.email} to ${request.url}`);
                throw new ForbiddenException('Admin access required');
            }
        }


        // Attach user/session to request
        request['user'] = {
            userId: session.userId,
            sessionId: token,
            provider: session.authProvider,
            roles: user.roles
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
