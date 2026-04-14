import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type WishlistDocument = HydratedDocument<Wishlist>;

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop([{
    course_id: { type: MongooseSchema.Types.ObjectId, ref: 'Course' },
    added_at: { type: Date, default: Date.now },
  }])
  items: Array<{
    course_id: MongooseSchema.Types.ObjectId;
    added_at: Date;
  }>;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
