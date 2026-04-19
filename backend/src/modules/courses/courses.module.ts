import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course, CourseSchema } from './entities/course.entity';
import { CourseContent, CourseContentSchema } from './entities/course-content.entity';
import { Enrollment, EnrollmentSchema } from './entities/enrollment.entity';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/users.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: CourseContent.name, schema: CourseContentSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
    AuthModule,
    UsersModule,
    forwardRef(() => UploadsModule),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
