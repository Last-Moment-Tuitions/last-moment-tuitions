
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).select('+passwordHash').exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).select('+passwordHash').exec();
    }

    async findBySupabaseId(supabaseId: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ supabaseId }).exec();
    }

    async create(userData: Partial<User>): Promise<UserDocument> {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }

    async updateById(
        id: string,
        update: any,
    ) {
        return this.userModel.updateOne({ _id: id }, update).exec();
    }


}
