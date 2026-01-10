import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type CourseContentDocument = HydratedDocument<CourseContent>;

@Schema({ timestamps: true })
export class CourseContent {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  course_id: MongooseSchema.Types.ObjectId;

  @Prop({ default: 1 })
  version: number;

  // Nested curriculum structure - recursive folders and files
  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  content: Array<{
    id: string;
    type: 'folder' | 'file';
    title: string;
    order?: number;
    children?: any[]; // Recursive structure for folders
    data?: {
      type: 'video' | 'document' | 'quiz' | 'assignment';
      is_locked: boolean;
      content: string; // URL or resource ID
      duration: number; // in seconds
      description: string;
    };
  }>;

  @Prop({ default: true })
  is_active: boolean;
}

export const CourseContentSchema = SchemaFactory.createForClass(CourseContent);

// Indexes
CourseContentSchema.index({ course_id: 1, version: -1 });
