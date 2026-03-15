import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './entities/cart.entity';
import { SyncCartDto } from './dto/sync-cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async getCart(userId: string): Promise<CartDocument> {
    let cart = await this.cartModel.findOne({ user_id: new Types.ObjectId(userId) }).populate('items.course_id');
    if (!cart) {
      cart = await this.cartModel.create({ user_id: new Types.ObjectId(userId), items: [] });
    }
    return cart;
  }

  async addItem(userId: string, courseId: string) {
    const cart = await this.getCart(userId);
    // Point 3: Safe check for missing course_id to prevent server crash
    const exists = cart.items.find(item => item.course_id?.['_id']?.toString() === courseId);
    if (!exists) {
      cart.items.push({ course_id: new Types.ObjectId(courseId) as any, added_at: new Date() });
      await cart.save();
    }
    return this.getCart(userId);
  }

  async removeItem(userId: string, courseId: string) {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(item => item.course_id?.['_id']?.toString() !== courseId);
    await cart.save();
    return this.getCart(userId);
  }

  async syncCart(userId: string, syncDto: SyncCartDto) {
    const cart = await this.getCart(userId);
    const existingIds = cart.items.map(item => item.course_id?.['_id']?.toString());
    
    for (const id of syncDto.course_ids) {
      if (!existingIds.includes(id)) {
        cart.items.push({ course_id: new Types.ObjectId(id) as any, added_at: new Date() });
      }
    }
    await cart.save();
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    cart.items = [];
    await cart.save();
    return cart;
  }
}
