
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @MaxLength(100)
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsNumber()
    @IsNotEmpty()
    phone: number;
}
