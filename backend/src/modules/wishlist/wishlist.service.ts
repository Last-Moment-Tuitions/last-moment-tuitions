import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './entities/wishlist.entity';
import { SyncWishlistDto } from './dto/sync-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(@InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>) {}

  async getWishlist(userId: string): Promise<WishlistDocument> {
    let wishlist = await this.wishlistModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .populate('items.course_id');

    if (!wishlist) {
      wishlist = await this.wishlistModel.create({ user_id: new Types.ObjectId(userId), items: [] });
    }

    return wishlist;
  }

  async addItem(userId: string, courseId: string) {
    const wishlist = await this.getWishlist(userId);
    const exists = wishlist.items.find(item => item.course_id?.['_id']?.toString() === courseId);

    if (!exists) {
      wishlist.items.push({ course_id: new Types.ObjectId(courseId) as any, added_at: new Date() });
      await wishlist.save();
    }

    return this.getWishlist(userId);
  }

  async removeItem(userId: string, courseId: string) {
    const wishlist = await this.getWishlist(userId);
    wishlist.items = wishlist.items.filter(item => item.course_id?.['_id']?.toString() !== courseId);
    await wishlist.save();
    return this.getWishlist(userId);
  }

  async syncWishlist(userId: string, syncDto: SyncWishlistDto) {
    const wishlist = await this.getWishlist(userId);
    const existingIds = wishlist.items.map(item => item.course_id?.['_id']?.toString());

    for (const id of syncDto.course_ids) {
      if (!existingIds.includes(id)) {
        wishlist.items.push({ course_id: new Types.ObjectId(id) as any, added_at: new Date() });
      }
    }

    await wishlist.save();
    return this.getWishlist(userId);
  }
}
