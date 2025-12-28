"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const supabase_service_1 = require("../supabase/supabase.service");
const argon2 = require("argon2");
const ioredis_1 = require("ioredis");
const uuid_1 = require("uuid");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(usersService, supabaseService, redis) {
        this.usersService = usersService;
        this.supabaseService = supabaseService;
        this.redis = redis;
    }
    async signup(signupDto) {
        const existingUser = await this.usersService.findByEmail(signupDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await argon2.hash(signupDto.password);
        return this.usersService.create(Object.assign(Object.assign({}, signupDto), { passwordHash: hashedPassword, authProviders: ['local'] }));
    }
    async login(loginDto, ip, userAgent) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isValid = await argon2.verify(user.passwordHash, loginDto.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.checkSessionConsistency(user);
        return this.createSession(user, 'local', ip, userAgent);
    }
    async googleLogin(googleLoginDto, ip, userAgent) {
        var _a, _b, _c, _d;
        const supabaseUser = await this.supabaseService.verifyToken(googleLoginDto.token);
        const email = supabaseUser.email;
        const supabaseId = supabaseUser.id;
        if (!email)
            throw new common_1.BadRequestException('Google account must have an email');
        let user = await this.usersService.findByEmail(email);
        if (!user) {
            user = await this.usersService.create({
                email,
                firstName: ((_b = (_a = supabaseUser.user_metadata) === null || _a === void 0 ? void 0 : _a.full_name) === null || _b === void 0 ? void 0 : _b.split(' ')[0]) || 'User',
                lastName: ((_d = (_c = supabaseUser.user_metadata) === null || _c === void 0 ? void 0 : _c.full_name) === null || _d === void 0 ? void 0 : _d.split(' ')[1]) || '',
                supabaseId,
                authProviders: ['google'],
                isActive: true,
            });
        }
        else {
            if (!user.supabaseId) {
                user.supabaseId = supabaseId;
                if (!user.authProviders.includes('google')) {
                    user.authProviders.push('google');
                }
                await user.save();
            }
        }
        return this.createSession(user, 'google', ip, userAgent);
    }
    async checkSessionConsistency(user) {
        if (!user.activeSessions || user.activeSessions.length === 0)
            return;
        let dirty = false;
        let expiredFound = false;
        const validSessions = [];
        for (const sessionId of user.activeSessions) {
            const exists = await this.redis.exists(`session:${sessionId}`);
            if (!exists) {
                dirty = true;
                expiredFound = true;
            }
            else {
                validSessions.push(sessionId);
            }
        }
        if (dirty) {
            user.activeSessions = validSessions;
            await user.save();
            if (expiredFound) {
                throw new common_1.UnauthorizedException('Session expired. Please log in again.');
            }
        }
    }
    async logout(sessionId) {
        var _a;
        const sessionKey = `session:${sessionId}`;
        const userId = await this.redis.hget(sessionKey, 'userId');
        await this.redis.del(sessionKey);
        if (userId) {
            await this.redis.lrem(`user:sessions:${userId}`, 0, sessionId);
            try {
                await this.usersService.updateById(userId, { $pull: { activeSessions: sessionId } });
            }
            catch (error) {
                (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `Failed to remove session ${sessionId} from Mongo for user ${userId}`, error instanceof Error ? error.stack : String(error));
            }
        }
        return { message: 'Logged out successfully' };
    }
    async createSession(user, provider, ip, userAgent) {
        const userId = user._id.toString();
        const userSessionsKey = `user:sessions:${userId}`;
        const MAX_SESSIONS = 3;
        const SESSION_TTL = 24 * 60 * 60;
        const deviceHash = (0, crypto_1.createHash)('sha256').update(`${userAgent}${ip}`).digest('hex');
        const currentSessionIds = await this.redis.lrange(userSessionsKey, 0, -1);
        for (let i = currentSessionIds.length - 1; i >= 0; i--) {
            const sid = currentSessionIds[i];
            const exists = await this.redis.exists(`session:${sid}`);
            if (exists) {
                const sessionData = await this.redis.hgetall(`session:${sid}`);
                if (sessionData.deviceHash === deviceHash) {
                    console.log(`[DEBUG] Reusing session (${sid}) for device (${deviceHash})`);
                    const _a = user.toObject ? user.toObject() : user, { passwordHash } = _a, safeUser = __rest(_a, ["passwordHash"]);
                    return {
                        accessToken: sid,
                        expiresIn: SESSION_TTL,
                        user: safeUser
                    };
                }
            }
        }
        const sessionId = (0, uuid_1.v4)();
        const sessionKey = `session:${sessionId}`;
        const sessionCount = await this.redis.llen(userSessionsKey);
        if (sessionCount >= MAX_SESSIONS) {
            const oldestSessionId = await this.redis.lpop(userSessionsKey);
            if (oldestSessionId) {
                await this.redis.del(`session:${oldestSessionId}`);
            }
        }
        const sessionData = {
            userId,
            issuedAt: Date.now(),
            authProvider: provider,
            lastActiveAt: Date.now(),
            deviceHash,
        };
        const pipeline = this.redis.pipeline();
        pipeline.rpush(userSessionsKey, sessionId);
        pipeline.hmset(sessionKey, sessionData);
        pipeline.expire(sessionKey, SESSION_TTL);
        const results = await pipeline.exec();
        console.log(`[DEBUG] Session Created: Key=${sessionKey}, User=${userId}`);
        if (!user.activeSessions)
            user.activeSessions = [];
        user.activeSessions.push(sessionId);
        if (user.activeSessions.length > MAX_SESSIONS) {
            user.activeSessions.shift();
        }
        await user.save();
        const _b = user.toObject ? user.toObject() : user, { passwordHash } = _b, safeUser = __rest(_b, ["passwordHash"]);
        return {
            accessToken: sessionId,
            expiresIn: SESSION_TTL,
            user: safeUser
        };
    }
    async validateSession(sessionId) {
        const session = await this.redis.hgetall(`session:${sessionId}`);
        if (!session || !session.userId)
            return null;
        return session;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        supabase_service_1.SupabaseService,
        ioredis_1.default])
], AuthService);
//# sourceMappingURL=auth.service.js.map