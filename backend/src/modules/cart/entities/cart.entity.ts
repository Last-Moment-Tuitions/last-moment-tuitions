import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
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

export const CartSchema = SchemaFactory.createForClass(Cart);
