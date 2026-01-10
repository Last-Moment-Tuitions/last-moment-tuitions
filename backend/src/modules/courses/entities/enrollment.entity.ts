import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type EnrollmentDocument = HydratedDocument<Enrollment>;

@Schema({ timestamps: true })
export class Enrollment {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  course_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ default: () => new Date() })
  enrolled_at: Date;

  @Prop({ default: null })
  expires_at: Date;

  // Progress tracking
  @Prop({
    type: {
      completed_nodes: [String],
      current_node: String,
      percentage_complete: Number,
      last_accessed_at: Date,
    },
    default: {
      completed_nodes: [],
      current_node: null,
      percentage_complete: 0,
      last_accessed_at: null,
    },
  })
  progress: {
    completed_nodes: string[];
    current_node: string;
    percentage_complete: number;
    last_accessed_at: Date;
  };

  // Reviews
  @Prop({ default: null, min: 0, max: 5 })
  rating: number;

  @Prop({ default: '' })
  review: string;

  @Prop({ default: null })
  reviewed_at: Date;

  // Certification
  @Prop({ default: false })
  certificate_issued: boolean;

  @Prop({ default: null })
  certificate_issued_at: Date;

  @Prop({ default: '' })
  certificate_url: string;

  @Prop({ type: String, enum: ['active', 'completed', 'expired'], default: 'active' })
  status: string;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);

// Indexes
EnrollmentSchema.index({ course_id: 1, user_id: 1 }, { unique: true });
EnrollmentSchema.index({ user_id: 1, status: 1 });
