import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Order {
  @Prop({ required: true, unique: true })
  order_id: string;

  @Prop({ required: true })
  course_id: string;

  @Prop({ required: true })
  course_title: string;

  @Prop({ required: true })
  user_name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ required: true })
  final_amount: number;

  @Prop({ required: true, default: 'pending_payment' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
