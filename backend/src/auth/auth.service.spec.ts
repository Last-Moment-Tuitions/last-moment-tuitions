
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';

// Mock Dependencies
const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
};

const mockSupabaseService = {
    verifyToken: jest.fn(),
};

const mockRedis = {
    llen: jest.fn(),
    lpop: jest.fn(),
    del: jest.fn(),
    pipeline: jest.fn().mockReturnThis(),
    rpush: jest.fn().mockReturnThis(),
    hmset: jest.fn().mockReturnThis(),
    expire: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    hget: jest.fn(),
    hgetall: jest.fn(),
    lrange: jest.fn(),
    exists: jest.fn(),
    lrem: jest.fn(),
};

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: SupabaseService, useValue: mockSupabaseService },
                { provide: 'REDIS_CLIENT', useValue: mockRedis },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    describe('signup', () => {
        it('should successfully create a user', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            jest.spyOn(argon2, 'hash').mockResolvedValue('hashed_password');
            mockUsersService.create.mockResolvedValue({ _id: 'new-user', email: 'test@example.com' });

            const result = await service.signup({ email: 'test@example.com', password: 'password', firstName: 'Test', lastName: 'User', phone: 1234567890 });

            expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(mockUsersService.create).toHaveBeenCalled();
            expect(result).toEqual({ _id: 'new-user', email: 'test@example.com' });
        });

        it('should throw ConflictException if email exists', async () => {
            mockUsersService.findByEmail.mockResolvedValue({ _id: 'existing' });

            await expect(service.signup({ email: 'test@example.com', password: 'password', firstName: 'Test', lastName: 'User', phone: 1234567890 }))
                .rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        const mockUser = {
            _id: 'user-123',
            email: 'test@example.com',
            passwordHash: 'hashed_password',
            toObject: () => ({ _id: 'user-123', email: 'test@example.com' }), // Simulate Mongoose doc
            save: jest.fn(),
        };

        it('should return session on valid credentials', async () => {
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(argon2, 'verify').mockResolvedValue(true);

            // Mock Redis for createSession logic
            mockRedis.lrange.mockResolvedValue([]); // No existing sessions logic triggered
            mockRedis.llen.mockResolvedValue(0);
            mockRedis.pipeline().exec.mockResolvedValue([]);

            const result = await service.login({ email: 'test@example.com', password: 'password' }, '127.0.0.1', 'jest-agent');

            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('user');
        });

        it('should throw UnauthorizedException on invalid password', async () => {
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(argon2, 'verify').mockResolvedValue(false);

            await expect(service.login({ email: 'test@example.com', password: 'wrong' }, '127.0.0.1', 'agent'))
                .rejects.toThrow(UnauthorizedException);
        });
    });

    describe('createSession (session management)', () => {
        it('should evict oldest session if limit (3) is reached', async () => {
            // Mock Redis
            mockRedis.lrange.mockResolvedValue([]);
            mockRedis.llen.mockResolvedValue(3);
            mockRedis.lpop.mockResolvedValue('old-session-id');

            // Invoke via private method access
            await service['createSession']({ _id: 'user-123', toObject: () => ({ _id: 'user-123' }), save: jest.fn() }, 'local', '127.0.0.1', 'jest-test');

            expect(mockRedis.llen).toHaveBeenCalledWith('user:sessions:user-123');
            expect(mockRedis.lpop).toHaveBeenCalledWith('user:sessions:user-123');
            expect(mockRedis.del).toHaveBeenCalledWith('session:old-session-id');
        });
    });

    describe('logout', () => {
        it('should clear session from redis', async () => {
            mockRedis.hget.mockResolvedValue('user-123');

            await service.logout('session-id-to-remove');

            expect(mockRedis.del).toHaveBeenCalledWith('session:session-id-to-remove');
            expect(mockRedis.lrem).toHaveBeenCalledWith('user:sessions:user-123', 0, 'session-id-to-remove');
        });
    });
});
