import { IsNotEmpty, IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty({ message: 'Reset token is required' })
    @IsUUID('4', { message: 'Invalid reset token format' })
    resetToken: string;

    @IsString()
    @IsNotEmpty({ message: 'New password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @MaxLength(100)
    newPassword: string;
}
