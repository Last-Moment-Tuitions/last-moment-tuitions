import { UsersService } from '../users/users.service';
import { SupabaseService } from '../supabase/supabase.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import Redis from 'ioredis';
export declare class AuthService {
    private usersService;
    private supabaseService;
    private redis;
    constructor(usersService: UsersService, supabaseService: SupabaseService, redis: Redis);
    signup(signupDto: SignupDto): Promise<import("../users/schemas/user.schema").UserDocument>;
    login(loginDto: LoginDto, ip: string, userAgent: string): Promise<{
        accessToken: string;
        expiresIn: number;
        user: any;
    }>;
    googleLogin(googleLoginDto: GoogleLoginDto, ip: string, userAgent: string): Promise<{
        accessToken: string;
        expiresIn: number;
        user: any;
    }>;
    private checkSessionConsistency;
    logout(sessionId: string): Promise<{
        message: string;
    }>;
    private createSession;
    validateSession(sessionId: string): Promise<Record<string, string>>;
}
