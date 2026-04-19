import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type EnrollmentDocument = HydratedDocument<Enrollment>;

@Schema({ timestamps: true })
export class Enrollment {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ default: () => new Date() })
  enrolledAt: Date;

  @Prop({ default: null })
  expiresAt: Date;

  // Progress tracking
  @Prop({
    type: {
      completedNodes: [String],
      currentNode: String,
      percentageComplete: Number,
      lastAccessedAt: Date,
    },
    default: {
      completedNodes: [],
      currentNode: null,
      percentageComplete: 0,
      lastAccessedAt: null,
    },
  })
  progress: {
    completedNodes: string[];
    currentNode: string;
    percentageComplete: number;
    lastAccessedAt: Date;
  };

  // Reviews
  @Prop({ default: null, min: 0, max: 5 })
  rating: number;

  @Prop({ default: '' })
  review: string;

  @Prop({ default: null })
  reviewedAt: Date;

  // Certification
  @Prop({ default: false })
  certificateIssued: boolean;

  @Prop({ default: null })
  certificateIssuedAt: Date;

  @Prop({ default: '' })
  certificateUrl: string;

  @Prop({ type: String, enum: ['active', 'completed', 'expired'], default: 'active' })
  status: string;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);

// Indexes
EnrollmentSchema.index({ courseId: 1, userId: 1 }, { unique: true });
EnrollmentSchema.index({ userId: 1, status: 1 });
EnrollmentSchema.index({ enrolledAt: -1 });
EnrollmentSchema.index({ status: 1 });
