import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Folder extends Document {
    @Prop({ required: true, maxlength: 50 })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'Folder', default: null })
    parent: Types.ObjectId | null;

    @Prop({ enum: ['page', 'template'], default: 'page' })
    type: 'page' | 'template';
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
