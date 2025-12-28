import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<import("../users/schemas/user.schema").UserDocument>;
    login(loginDto: LoginDto, req: any): Promise<{
        accessToken: string;
        expiresIn: number;
        user: any;
    }>;
    googleLogin(googleLoginDto: GoogleLoginDto, req: any): Promise<{
        accessToken: string;
        expiresIn: number;
        user: any;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<any>;
}
