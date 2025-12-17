import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type FolderDocument = HydratedDocument<Folder>;

@Schema({ timestamps: true })
export class Folder {
  @Prop({ required: true, trim: true, maxlength: 50 })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Folder', default: null })
  parent: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: ['page', 'template'], default: 'page' })
  type: string;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
