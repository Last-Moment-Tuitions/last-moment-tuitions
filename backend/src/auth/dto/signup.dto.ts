
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class SignupDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @MaxLength(100)
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Confirm password is required' })
    confirmPassword: string;

    @IsString()
    @IsNotEmpty({ message: 'First name is required' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Last name is required' })
    lastName: string;

    @IsString()
    @IsNotEmpty({ message: 'Phone number is required' })
    @Matches(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit Indian mobile number' })
    phone: string;
}
