import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Page extends Document {
    @Prop({ required: true, maxlength: 60 })
    title: string;

    @Prop({ required: true, unique: true, lowercase: true })
    slug: string;

    @Prop({ maxlength: 160 })
    metaDescription?: string;

    @Prop({ type: [Object], default: [] })
    gjsComponents: any[];

    @Prop({ type: [Object], default: [] })
    gjsStyles: any[];

    @Prop({ type: String, default: '' })
    gjsHtml: string;

    @Prop({ type: String, default: '' })
    gjsCss: string;

    @Prop({ enum: ['page', 'template'], default: 'page' })
    type: 'page' | 'template';

    @Prop({ enum: ['draft', 'published', 'archived'], default: 'draft' })
    status: string;

    @Prop({ default: 0 })
    viewCount: number;

    @Prop({ type: Types.ObjectId, ref: 'Folder', default: null })
    folder: Types.ObjectId | null;
}

export const PageSchema = SchemaFactory.createForClass(Page);
