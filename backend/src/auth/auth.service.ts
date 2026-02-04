
import { Injectable, UnauthorizedException, ConflictException, Inject, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SupabaseService } from '../supabase/supabase.service';
import { EmailService } from '../email/email.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import * as argon2 from 'argon2';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private supabaseService: SupabaseService,
        private emailService: EmailService,
        @Inject('REDIS_CLIENT') private redis: Redis,
    ) { }

    async signup(signupDto: SignupDto) {
        if (signupDto.password !== signupDto.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const existingUser = await this.usersService.findByEmail(signupDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await argon2.hash(signupDto.password);

        // Remove confirmPassword before passing to usersService
        const { confirmPassword, phone, ...rest } = signupDto;

        return this.usersService.create({
            ...rest,
            phone: Number(phone),
            passwordHash: hashedPassword,
            authProviders: ['local'],
            signupMethod: 'local',
        });
    }

    async login(loginDto: LoginDto, ip: string, userAgent: string) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || !user.passwordHash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await argon2.verify(user.passwordHash, loginDto.password);
        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Strict Consistency Check
        await this.checkSessionConsistency(user);

        return this.createSession(user, 'local', ip, userAgent);
    }

    async googleLogin(googleLoginDto: GoogleLoginDto, ip: string, userAgent: string) {
        const supabaseUser = await this.supabaseService.verifyToken(googleLoginDto.token);
        const email = supabaseUser.email;
        const supabaseId = supabaseUser.id;

        if (!email) throw new BadRequestException('Google account must have an email');

        let user = await this.usersService.findByEmail(email);

        if (!user) {
            // Create new user from Google
            user = await this.usersService.create({
                email,
                firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || 'User',
                lastName: supabaseUser.user_metadata?.full_name?.split(' ')[1] || '',
                supabaseId,
                authProviders: ['google'],
                signupMethod: 'google',
                isActive: true,
            });
        } else {
            // Link existing user if needed, or update ID
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

    // --- Strict Consistency Check ---
    // Mirrors Mongo activeSessions against Redis. If Mongo has it but Redis doesn't -> REJECT.
    private async checkSessionConsistency(user: any) {
        if (!user.activeSessions || user.activeSessions.length === 0) return;

        let dirty = false;
        let expiredFound = false;
        const validSessions = [];

        for (const sessionId of user.activeSessions) {
            const exists = await this.redis.exists(`session:${sessionId}`);
            if (!exists) {
                dirty = true;
                expiredFound = true;
                // Session in Mongo but missing in Redis -> EXPIRED/RESTART
            } else {
                validSessions.push(sessionId);
            }
        }

        if (dirty) {
            user.activeSessions = validSessions;
            await user.save(); // Clean up Mongo

            if (expiredFound) {
                throw new UnauthorizedException('Session expired. Please log in again.');
            }
        }
    }

    async logout(sessionId: string) {
        const sessionKey = `session:${sessionId}`;

        // Step 1: get userId from Redis
        const userId = await this.redis.hget(sessionKey, 'userId');

        // Step 2: Always delete session key (idempotent)
        await this.redis.del(sessionKey);

        // Step 3: If userId exists, clean user session list
        if (userId) {
            await this.redis.lrem(`user:sessions:${userId}`, 0, sessionId);

            // Step 4: Mongo cleanup (best effort, NEVER block logout)
            try {
                await this.usersService.updateById(
                    userId,
                    { $pull: { activeSessions: sessionId } }
                );
            } catch (error) {
                // Best-effort cleanup: Redis is authoritative, never block logout
                console.warn?.(
                    `Failed to remove session ${sessionId} from Mongo for user ${userId}`,
                    error instanceof Error ? error.stack : String(error),
                );
            }


        }

        return { message: 'Logged out successfully' };
    }

    // --- Session Management (Hybrid & Strict) ---
    private async createSession(user: any, provider: string, ip: string, userAgent: string) {
        const userId = user._id.toString();
        const userSessionsKey = `user:sessions:${userId}`;
        const MAX_SESSIONS = 3;
        const SESSION_TTL = 24 * 60 * 60; // 24 hours

        // Generate Device Hash (SHA256 of UserAgent + IP)
        const deviceHash = createHash('sha256').update(`${userAgent}${ip}`).digest('hex');

        // 1. REUSE: Check for existing valid session
        // We can check the Redis list. The most recent is at the right (rpush).
        const currentSessionIds = await this.redis.lrange(userSessionsKey, 0, -1);

        // Iterate reversed to find most recent valid
        for (let i = currentSessionIds.length - 1; i >= 0; i--) {
            const sid = currentSessionIds[i];
            const exists = await this.redis.exists(`session:${sid}`);
            if (exists) {
                // Reuse this session ONLY if deviceHash matches
                const sessionData = await this.redis.hgetall(`session:${sid}`);
                if (sessionData.deviceHash === deviceHash) {
                    console.log(`[DEBUG] Reusing session (${sid}) for device (${deviceHash})`);
                    // Remove sensitive data
                    const { passwordHash, ...safeUser } = user.toObject ? user.toObject() : user;
                    return {
                        accessToken: sid,
                        expiresIn: SESSION_TTL, // This is static, ideally we'd get TTL from Redis
                        user: safeUser
                    };
                }
            }
        }

        // 2. CREATE NEW (No valid session found)
        const sessionId = uuidv4();
        const sessionKey = `session:${sessionId}`;

        // 3. FIFO Logic (Redis)
        const sessionCount = await this.redis.llen(userSessionsKey);
        if (sessionCount >= MAX_SESSIONS) {
            const oldestSessionId = await this.redis.lpop(userSessionsKey);
            if (oldestSessionId) {
                await this.redis.del(`session:${oldestSessionId}`);
            }
        }

        // 4. Create new session in Redis
        const sessionData = {
            userId,
            issuedAt: Date.now(),
            authProvider: provider,
            lastActiveAt: Date.now(),
            deviceHash, // Store device hash
        };

        const pipeline = this.redis.pipeline();
        pipeline.rpush(userSessionsKey, sessionId);
        pipeline.hmset(sessionKey, sessionData);
        pipeline.expire(sessionKey, SESSION_TTL);
        const results = await pipeline.exec();

        console.log(`[DEBUG] Session Created: Key=${sessionKey}, User=${userId}`);

        // 5. Update MongoDB (Mirror)
        if (!user.activeSessions) user.activeSessions = [];
        user.activeSessions.push(sessionId);
        // Enforce Max 3 in Mongo too (should match Redis, but for safety)
        if (user.activeSessions.length > MAX_SESSIONS) {
            user.activeSessions.shift(); // Remove oldest
        }
        await user.save();

        // Remove sensitive data before returning
        const { passwordHash, ...safeUser } = user.toObject ? user.toObject() : user;

        return {
            accessToken: sessionId,
            expiresIn: SESSION_TTL,
            user: safeUser
        };
    }

    async validateSession(sessionId: string) {
        const session = await this.redis.hgetall(`session:${sessionId}`);
        if (!session || !session.userId) return null;
        return session;
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new BadRequestException('User with this email does not exist');
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store in Redis with 1 min TTL
        await this.redis.set(`otp:${email}`, otp, 'EX', 60);

        // Send OTP via email
        await this.emailService.sendOtpEmail(email, otp);
        console.log(`[DEBUG] OTP sent to ${email}: ${otp}`);

        return { message: 'OTP sent to email' };
    }

    async verifyOtp(email: string, otp: string, ip: string, userAgent: string) {
        const storedOtp = await this.redis.get(`otp:${email}`);

        if (!storedOtp || storedOtp !== otp) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        // Clear OTP after successful verification
        await this.redis.del(`otp:${email}`);

        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Direct login after OTP verification
        return this.createSession(user, 'otp', ip, userAgent);
    }

    // Step 2 Backend: Verify OTP and provide a temporary Reset Token
    async verifyOtpForReset(email: string, otp: string) {
        const storedOtp = await this.redis.get(`otp:${email}`);

        if (!storedOtp || storedOtp !== otp) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        // Generate temporary Reset Token (valid for 10 mins)
        const resetToken = uuidv4();
        await this.redis.set(`reset_token:${resetToken}`, email, 'EX', 600);

        // Delete OTP so it's only used once
        await this.redis.del(`otp:${email}`);

        return { resetToken };
    }

    // Step 3 Backend: Use the token to change the password
    async resetPassword(resetToken: string, newPassword: string) {
        const email = await this.redis.get(`reset_token:${resetToken}`);

        if (!email) {
            throw new UnauthorizedException('Invalid or expired reset token. Please start again.');
        }

        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const hashedPassword = await argon2.hash(newPassword);
        await this.usersService.updateById(user._id.toString(), {
            passwordHash: hashedPassword
        });

        // Clean up the reset token
        await this.redis.del(`reset_token:${resetToken}`);

        return { message: 'Password reset successfully' };
    }
}
