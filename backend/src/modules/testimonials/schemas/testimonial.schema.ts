import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Testimonial extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    image: string;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop({ required: true })
    message: string;

    // This is the key for your filtering (e.g., ["Sem 4 Comps", "Homepage"])
    @Prop({ type: [String], default: [], index: true })
    target_pages: string[];
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);