
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SupabaseService } from '../supabase/supabase.service';

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
    lrem: jest.fn(),
};

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: {} },
                { provide: SupabaseService, useValue: {} },
                { provide: 'REDIS_CLIENT', useValue: mockRedis },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    describe('createSession (private method accessed via login)', () => {
        it('should evict oldest session if limit (3) is reached', async () => {
            // Access private method via casting (or test via login public method with mocks)
            // For unit test clarity, we assume we invoke the logic that calls redis

            // Mock Setup: User has 3 sessions
            mockRedis.llen.mockResolvedValue(3);
            mockRedis.lpop.mockResolvedValue('old-session-id');

            // Call internal logic (simulated)
            await service['createSession']({ _id: 'user-123', toObject: () => ({ _id: 'user-123' }) }, 'local', '127.0.0.1', 'jest-test');

            // Expectations
            expect(mockRedis.llen).toHaveBeenCalledWith('user:sessions:user-123');
            expect(mockRedis.lpop).toHaveBeenCalledWith('user:sessions:user-123'); // Eviction triggered
            expect(mockRedis.del).toHaveBeenCalledWith('session:old-session-id'); // Old session deleted
            expect(mockRedis.pipeline).toHaveBeenCalled(); // New session created
        });

        it('should NOT evict if sessions < 3', async () => {
            // Mock Setup: User has 2 sessions
            mockRedis.llen.mockResolvedValue(2);

            // Call internal logic
            await service['createSession']({ _id: 'user-123', toObject: () => ({ _id: 'user-123' }) }, 'local', '127.0.0.1', 'jest-test');

            // Expectations
            expect(mockRedis.lpop).not.toHaveBeenCalled(); // No eviction
            expect(mockRedis.pipeline).toHaveBeenCalled(); // New session created
        });
    });
});
