
import { Controller, Post, Body, UseGuards, Get, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AuthGuard } from './guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // Rate limit login attempts
    async login(@Body() loginDto: LoginDto, @Req() req) {
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'unknown';
        return this.authService.login(loginDto, ip, userAgent);
    }

    @Post('google')
    @HttpCode(HttpStatus.OK)
    async googleLogin(@Body() googleLoginDto: GoogleLoginDto, @Req() req) {
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'unknown';
        return this.authService.googleLogin(googleLoginDto, ip, userAgent);
    }

    @Post('logout')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req) {
        return this.authService.logout(req.user.sessionId);
    }

    @Get('me')
    @UseGuards(AuthGuard)
    async getProfile(@Req() req) {
        return req.user;
    }
}
