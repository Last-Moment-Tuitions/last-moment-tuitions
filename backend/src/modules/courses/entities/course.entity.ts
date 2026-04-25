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
  subCategory: string;

  @Prop({ default: '', trim: true })
  topic: string;

  @Prop({ default: 'english', trim: true })
  language: string;

  @Prop({ default: '', trim: true })
  subtitleLanguage: string;

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
  whatToLearn: string[];

  @Prop({ type: [String], default: [] })
  targetAudience: string[];

  @Prop({ type: [String], default: [] })
  requirements: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  // PUBLISH COURSE (Step 4)
  @Prop({ type: String, default: '' })
  welcomeMessage: string;

  @Prop({ type: String, default: '' })
  congratulationsMessage: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  instructorIds: MongooseSchema.Types.ObjectId[];

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
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  price: number; // in paisa

  @Prop({ default: 0 })
  originalPrice: number; // in paisa

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ type: String, enum: ['draft', 'published', 'archived'], default: 'draft' })
  status: string;

  @Prop({ default: null })
  publishedAt: Date;

  @Prop({ default: null })
  lastUpdated: string; // e.g., "11/2024"

  // METRICS (auto-managed)
  @Prop({ default: 0 })
  enrollmentCount: number;

  @Prop({ default: 0, min: 0, max: 5 })
  averageRating: number;

  @Prop({ default: 0 })
  ratingCount: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ default: 0 })
  viewCount: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// Indexes
CourseSchema.index({ title: 'text', descriptions: 'text' }, { language_override: 'none' });
CourseSchema.index({ category: 1, status: 1 });
CourseSchema.index({ createdBy: 1, status: 1 });
CourseSchema.index({ status: 1, publishedAt: -1 });
CourseSchema.index({ updatedAt: -1 });
CourseSchema.index({ level: 1 });
