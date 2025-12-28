import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private usersService: UsersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        // req.user is populated by AuthGuard from the session
        if (!req.user || !req.user.userId) {
            return false;
        }

        // Fetch full user to check roles
        const user = await this.usersService.findById(req.user.userId);
        if (!user) {
            return false;
        }

        // Check if user has 'admin' role
        return user.roles.includes('admin');
    }
}
