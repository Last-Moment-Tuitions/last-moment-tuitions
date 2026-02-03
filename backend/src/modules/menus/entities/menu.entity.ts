import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MenuDocument = Menu & Document;

@Schema({ _id: false })
export class MenuItem {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true, enum: ['link', 'dropdown'] })
  type: string;

  @Prop()
  href: string;

  @Prop()
  target: string;

  @Prop({ default: 0 })
  order: number;

  // Manual recursion for Schema not strictly typed in NestJS Mongoose decorators easily,
  // but using generic array works for persistence.
  @Prop({ type: [Object], default: [] }) 
  items: MenuItem[]; 
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);

@Schema({ timestamps: true })
export class Menu {
  @Prop({ required: true, unique: true })
  name: string; // e.g., 'primary', 'footer'

  @Prop({ type: [MenuItemSchema], default: [] })
  items: MenuItem[];

  @Prop({ default: true })
  isActive: boolean;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
