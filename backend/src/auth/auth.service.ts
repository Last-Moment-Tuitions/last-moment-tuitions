
import { Injectable, UnauthorizedException, ConflictException, Inject, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FirebaseService } from '../firebase/firebase.service';
import { EmailService } from '../email/email.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { UserDocument } from '../users/schemas/user.schema';
import * as argon2 from 'argon2';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private firebaseService: FirebaseService,
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

        const newUser = await this.usersService.create({
            ...rest,
            phone: Number(phone),
            passwordHash: hashedPassword,
            authProviders: ['local'],
            signupMethod: 'local',
        });

        // Return only essential user data
        const userObj = newUser.toObject ? newUser.toObject() : newUser;
        return {
            user: {
                roles: userObj.roles,
                firstName: userObj.firstName,
                lastName: userObj.lastName,
                email: userObj.email
            },
            message: 'User created successfully'
        };
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
        const decodedToken = await this.firebaseService.verifyToken(googleLoginDto.token);
        const email = decodedToken.email;
        const firebaseUid = decodedToken.uid;

        if (!email) throw new BadRequestException('Google account must have an email');

        let user = await this.usersService.findByEmail(email);

        if (!user) {
            // Create new user from Google
            user = await this.usersService.create({
                email,
                firstName: decodedToken.name?.split(' ')[0] || 'User',
                lastName: decodedToken.name?.split(' ')[1] || '',
                firebaseUid,
                authProviders: ['google'],
                signupMethod: 'google',
                isActive: true,
            });
        } else {
            // Link existing user if needed, or update ID
            if (!user.firebaseUid) {
                user.firebaseUid = firebaseUid;
                if (!user.authProviders.includes('google')) {
                    user.authProviders.push('google');
                }
                await user.save();
            }
        }

        return this.createSession(user, 'google', ip, userAgent);
    }

    // --- Strict Consistency Check ---
    // Mirrors Mongo activeSessions against Redis. If Mongo has it but Redis doesn't -> EXPIRED/RESTART.
    private async checkSessionConsistency(user: UserDocument) {
        if (!user.activeSessions || user.activeSessions.length === 0) return;

        // Batch all EXISTS checks in a single pipeline round-trip
        const pipeline = this.redis.pipeline();
        for (const sessionId of user.activeSessions) {
            pipeline.exists(`session:${sessionId}`);
        }
        const results = await pipeline.exec();

        const validSessions = user.activeSessions.filter(
            (_: string, index: number) => results[index]?.[1] === 1,
        );

        if (validSessions.length !== user.activeSessions.length) {
            user.activeSessions = validSessions;
            await user.save();
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
    private async createSession(user: UserDocument, provider: string, ip: string, userAgent: string) {
        const userId = user._id.toString();
        const userSessionsKey = `user:sessions:${userId}`;
        const MAX_SESSIONS = 3;
        const SESSION_TTL = 60 * 60; // 60 minutes

        // Generate Device Hash (SHA256 of UserAgent + IP)
        const deviceHash = createHash('sha256').update(`${userAgent}${ip}`).digest('hex');

        // 1. REUSE: Fetch all session IDs then batch-fetch their data in one pipeline
        const currentSessionIds = await this.redis.lrange(userSessionsKey, 0, -1);

        if (currentSessionIds.length > 0) {
            // Batch: fetch all session hashes in one round-trip (most-recent first)
            const fetchPipeline = this.redis.pipeline();
            for (let i = currentSessionIds.length - 1; i >= 0; i--) {
                fetchPipeline.hgetall(`session:${currentSessionIds[i]}`);
            }
            const fetchResults = await fetchPipeline.exec();

            for (let i = 0; i < fetchResults.length; i++) {
                const sessionData = fetchResults[i]?.[1] as Record<string, string> | null;
                // A null/empty result means the key expired in Redis
                if (sessionData && sessionData.userId && sessionData.deviceHash === deviceHash) {
                    const sid = currentSessionIds[currentSessionIds.length - 1 - i];
                    const userObj = user.toObject ? user.toObject() : user;
                    return {
                        accessToken: sid,
                        expiresIn: SESSION_TTL,
                        user: {
                            roles: userObj.roles,
                            firstName: userObj.firstName,
                            lastName: userObj.lastName,
                            email: userObj.email,
                        },
                    };
                }
            }
        }

        // 2. CREATE NEW (No valid session found for this device)
        const sessionId = uuidv4();
        const sessionKey = `session:${sessionId}`;

        // 3. FIFO Logic (Redis) — evict oldest if at capacity
        const sessionCount = await this.redis.llen(userSessionsKey);
        if (sessionCount >= MAX_SESSIONS) {
            const oldestSessionId = await this.redis.lpop(userSessionsKey);
            if (oldestSessionId) {
                await this.redis.del(`session:${oldestSessionId}`);
            }
        }

        // 4. Create new session in Redis (single pipeline)
        const sessionData = {
            userId,
            issuedAt: Date.now().toString(),
            authProvider: provider,
            lastActiveAt: Date.now().toString(),
            deviceHash,
        };

        const writePipeline = this.redis.pipeline();
        writePipeline.rpush(userSessionsKey, sessionId);
        writePipeline.hmset(sessionKey, sessionData);
        writePipeline.expire(sessionKey, SESSION_TTL);
        await writePipeline.exec();

        // 5. Update MongoDB (Mirror)
        if (!user.activeSessions) user.activeSessions = [];
        user.activeSessions.push(sessionId);
        // Enforce max sessions in Mongo too (safety net mirroring Redis FIFO)
        if (user.activeSessions.length > MAX_SESSIONS) {
            user.activeSessions.shift();
        }
        await user.save();

        const userObj = user.toObject ? user.toObject() : user;
        return {
            accessToken: sessionId,
            expiresIn: SESSION_TTL,
            user: {
                roles: userObj.roles,
                firstName: userObj.firstName,
                lastName: userObj.lastName,
                email: userObj.email,
            },
        };
    }

    async validateSession(sessionId: string) {
        const session = await this.redis.hgetall(`session:${sessionId}`);
        if (!session || !session.userId) return null;

        // Sliding Expiration: Refresh TTL
        const SESSION_TTL = 60 * 60; // 60 minutes
        await this.redis.expire(`session:${sessionId}`, SESSION_TTL);

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

        return { message: 'OTP sent successfully to your email. Valid for 60 seconds.' };
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
    async getProfile(userId: string) {
        return this.usersService.findByIdPublic(userId);
    }
}
