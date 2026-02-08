import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { PageStatus } from '../enums/page-status.enum';

export type PageDocument = HydratedDocument<Page>;

@Schema({ timestamps: true })
export class Page {
  @Prop({ required: true, maxlength: 60 })
  title: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ maxlength: 160 })
  metaDescription: string;

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  content: any[];

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  gjsAssets: any[];

  @Prop({ type: String, enum: ['page', 'template'], default: 'page' })
  type: string;

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  gjsComponents: any[];

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  gjsStyles: any[];

  @Prop({
    type: String,
    enum: Object.values(PageStatus),
    default: PageStatus.DRAFT
  })
  status: string;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop()
  publishedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Folder', default: null })
  folder: MongooseSchema.Types.ObjectId;

  @Prop({ default: '' })
  gjsCss: string;

  @Prop({ default: '' })
  gjsHtml: string;
}

export const PageSchema = SchemaFactory.createForClass(Page);
