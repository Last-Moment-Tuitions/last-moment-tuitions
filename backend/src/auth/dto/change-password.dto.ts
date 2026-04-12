import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty({ message: 'Current password is required' })
    currentPassword: string;

    @IsString()
    @IsNotEmpty({ message: 'New password is required' })
    @MinLength(8, { message: 'New password must be at least 8 characters long' })
    @Matches(/[A-Z]/, { message: 'New password must include at least one uppercase letter' })
    @Matches(/[a-z]/, { message: 'New password must include at least one lowercase letter' })
    @Matches(/\d/, { message: 'New password must include at least one number' })
    @Matches(/[@$!%*?&]/, { message: 'New password must include at least one special character' })
    @MaxLength(100)
    newPassword: string;
}
