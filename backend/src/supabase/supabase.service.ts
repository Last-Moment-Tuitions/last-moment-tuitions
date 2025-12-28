
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        this.supabase = createClient(
            this.configService.get<string>('SUPABASE_URL'),
            this.configService.get<string>('SUPABASE_KEY'),
        );
    }

    async verifyToken(token: string) {
        const { data: { user }, error } = await this.supabase.auth.getUser(token);

        if (error || !user) {
            throw new UnauthorizedException('Invalid Supabase token');
        }
        return user;
    }
}
