import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthToken } from './schemas/auth-token.schema';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private redisService: RedisService,
    private configService: ConfigService,
    @InjectModel(AuthToken.name) private authTokenModel: Model<AuthToken>,
  ) {}

  async login(email: string, pass: string) {
    // 1. Validate User
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Manage Session Limits (Max 3)
    const activeTokens = await this.authTokenModel
      .find({ userId: user._id })
      .sort({ createdAt: 1 }) // Oldest first
      .exec();

    const maxSessions = this.configService.get<number>('MAX_CONCURRENT_SESSIONS') || 3;

    if (activeTokens.length >= maxSessions) {
      const tokensToRemoveCount = activeTokens.length - maxSessions + 1; // +1 because we are about to add a new one
      const tokensToRemove = activeTokens.slice(0, tokensToRemoveCount);

      for (const t of tokensToRemove) {
        // Remove from Redis
        await this.redisService.del(`auth_token:${t.token}`);
        // Remove from DB
        await this.authTokenModel.findByIdAndDelete(t._id).exec();
      }
    }

    // 3. Generate New Token
    const token = uuidv4();
    const ttlDays = this.configService.get<number>('TOKEN_TTL_DAYS') || 7;
    const ttlSeconds = ttlDays * 24 * 60 * 60;

    // 4. Store in DB
    const newAuthToken = new this.authTokenModel({
      userId: user._id,
      token: token,
    });
    await newAuthToken.save();

    // 5. Store in Redis
    await this.redisService.set(
      `auth_token:${token}`,
      JSON.stringify({ userId: user._id.toString(), role: user.role }),
      ttlSeconds,
    );

    return {
      accessToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(token: string) {
    // 1. Delete from Redis
    await this.redisService.del(`auth_token:${token}`);
    
    // 2. Delete from DB
    await this.authTokenModel.findOneAndDelete({ token }).exec();
  }

  async validateToken(token: string): Promise<any> {
    const userDataStr = await this.redisService.get(`auth_token:${token}`);
    if (!userDataStr) {
      return null;
    }
    return JSON.parse(userDataStr);
  }
}
