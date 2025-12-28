import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    findBySupabaseId(supabaseId: string): Promise<UserDocument | null>;
    create(userData: Partial<User>): Promise<UserDocument>;
    updateById(id: string, update: any): Promise<import("mongoose").UpdateWriteOpResult>;
}
