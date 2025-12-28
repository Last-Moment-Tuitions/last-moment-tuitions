
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
    @IsString()
    @IsNotEmpty()
    token: string; // The access token from Supabase client
}
