
import { Controller, Post, Body, UseGuards, Get, Req, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
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
        return this.authService.getProfile(req.user.userId);
    }

    @Patch('me/profile-photo')
    @UseGuards(AuthGuard)
    async updateProfilePhoto(@Req() req, @Body('profilePhoto') profilePhoto: string) {
        return this.authService.updateProfilePhoto(req.user.userId, profilePhoto);
    }

    @Post('me/change-password')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async changePassword(
        @Req() req,
        @Body() changePasswordDto: ChangePasswordDto
    ) {
        return this.authService.changePassword(
            req.user.userId, 
            changePasswordDto.currentPassword, 
            changePasswordDto.newPassword
        );
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    async verifyOtp(
        @Body() verifyOtpDto: VerifyOtpDto,
        @Req() req
    ) {
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'unknown';
        return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp, ip, userAgent);
    }

    @Post('verify-otp-for-reset')
    @HttpCode(HttpStatus.OK)
    async verifyOtpForReset(
        @Body() verifyOtpDto: VerifyOtpDto
    ) {
        return this.authService.verifyOtpForReset(verifyOtpDto.email, verifyOtpDto.otp);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto
    ) {
        return this.authService.resetPassword(
            resetPasswordDto.resetToken, 
            resetPasswordDto.newPassword
        );
    }
}
