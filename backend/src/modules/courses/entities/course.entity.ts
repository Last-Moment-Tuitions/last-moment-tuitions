import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  // BASIC INFORMATION (Step 1)
  @Prop({ required: true, maxlength: 80, trim: true })
  title: string;

  @Prop({ maxlength: 120, trim: true, default: '' })
  subtitle: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: null })
  sub_category: string;

  @Prop({ type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' })
  level: string;

  @Prop({ default: '' })
  duration: string;

  // ADVANCED INFORMATION (Step 2)
  @Prop({ default: '' })
  thumbnail: string;

  @Prop({ default: '' })
  trailer: string;

  @Prop({ type: String, default: '' })
  descriptions: string;

  @Prop({ type: [String], default: [] })
  what_to_learn: string[];

  @Prop({ type: [String], default: [] })
  target_audience: string[];

  @Prop({ type: [String], default: [] })
  requirements: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  // PUBLISH COURSE (Step 4)
  @Prop({ type: String, default: '' })
  welcome_message: string;

  @Prop({ type: String, default: '' })
  congratulations_message: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  instructor_ids: MongooseSchema.Types.ObjectId[];

  // INSTRUCTOR INFO (denormalized for display)
  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  instructor: {
    name: string;
    role: string;
    image: string;
    bio: string;
  };

  // PRICING & PUBLISHING
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  price: number; // in paisa

  @Prop({ default: 0 })
  original_price: number; // in paisa

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ type: String, enum: ['draft', 'published', 'archived'], default: 'draft' })
  status: string;

  @Prop({ default: null })
  published_at: Date;

  @Prop({ default: null })
  last_updated: string; // e.g., "11/2024"

  // METRICS (auto-managed)
  @Prop({ default: 0 })
  enrollment_count: number;

  @Prop({ default: 0, min: 0, max: 5 })
  average_rating: number;

  @Prop({ default: 0 })
  rating_count: number;

  @Prop({ default: 0 })
  review_count: number;

  @Prop({ default: 0 })
  view_count: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// Indexes
CourseSchema.index({ title: 'text', descriptions: 'text' });
CourseSchema.index({ category: 1, status: 1 });
CourseSchema.index({ created_by: 1, status: 1 });
CourseSchema.index({ status: 1, published_at: -1 });
