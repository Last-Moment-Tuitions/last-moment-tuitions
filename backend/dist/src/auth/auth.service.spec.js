"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const supabase_service_1 = require("../supabase/supabase.service");
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
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: users_service_1.UsersService, useValue: {} },
                { provide: supabase_service_1.SupabaseService, useValue: {} },
                { provide: 'REDIS_CLIENT', useValue: mockRedis },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        jest.clearAllMocks();
    });
    describe('createSession (private method accessed via login)', () => {
        it('should evict oldest session if limit (3) is reached', async () => {
            mockRedis.llen.mockResolvedValue(3);
            mockRedis.lpop.mockResolvedValue('old-session-id');
            await service['createSession']({ _id: 'user-123', toObject: () => ({ _id: 'user-123' }) }, 'local', '127.0.0.1', 'jest-test');
            expect(mockRedis.llen).toHaveBeenCalledWith('user:sessions:user-123');
            expect(mockRedis.lpop).toHaveBeenCalledWith('user:sessions:user-123');
            expect(mockRedis.del).toHaveBeenCalledWith('session:old-session-id');
            expect(mockRedis.pipeline).toHaveBeenCalled();
        });
        it('should NOT evict if sessions < 3', async () => {
            mockRedis.llen.mockResolvedValue(2);
            await service['createSession']({ _id: 'user-123', toObject: () => ({ _id: 'user-123' }) }, 'local', '127.0.0.1', 'jest-test');
            expect(mockRedis.lpop).not.toHaveBeenCalled();
            expect(mockRedis.pipeline).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map