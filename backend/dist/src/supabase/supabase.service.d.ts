import { ConfigService } from '@nestjs/config';
export declare class SupabaseService {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    verifyToken(token: string): Promise<import("@supabase/supabase-js").AuthUser>;
}
