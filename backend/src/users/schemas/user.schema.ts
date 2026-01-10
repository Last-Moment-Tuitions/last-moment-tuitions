
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, strict: true })
export class User {
    @Prop({ required: true, unique: true, index: true, trim: true })
    email: string;

    @Prop({ required: true, default: 'local' })
    signupMethod: string; // 'local' | 'google'

    @Prop({ select: false }) // Argon2 hash, never return by default
    passwordHash: string;

    @Prop({ unique: true, sparse: true })
    supabaseId: string; // For Google Auth users

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: false, type: Number })
    phone: number;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [String], default: ['user'] })
    roles: string[];

    @Prop({ type: [String], default: [] })
    authProviders: string[]; // 'local' | 'google'

    @Prop({ type: [String], default: [] })
    activeSessions: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
