import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateCourseContentDto } from './dto/update-course-content.dto';
import { FindCoursesQueryDto } from './dto/find-courses-query.dto';
import { Course, CourseDocument } from './entities/course.entity';
import { CourseContent, CourseContentDocument } from './entities/course-content.entity';

import { Enrollment, EnrollmentDocument } from './entities/enrollment.entity';
import { UploadsService } from '../uploads/uploads.service';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import * as crypto from 'crypto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(CourseContent.name) private courseContentModel: Model<CourseContentDocument>,
    @InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>,
    private readonly uploadsService: UploadsService,
  ) {}

  async create(createCourseDto: CreateCourseDto, userId: string) {
    const createdCourse = new this.courseModel({
      ...createCourseDto,
      createdBy: userId,
    });
    const savedCourse = await createdCourse.save();

    // Create empty course content document linked to the new course
    const courseContent = new this.courseContentModel({
      courseId: savedCourse._id,
      version: 1,
      content: [],
      isActive: true,
    });
    await courseContent.save();

    return savedCourse;
  }

  async findAll(query: FindCoursesQueryDto) {
    const { category, status, createdBy, search } = query;
    const filter: Record<string, any> = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (createdBy) filter.createdBy = createdBy;
    if (search) filter.$text = { $search: search };

    return this.courseModel
      .find(filter)
      .select('-__v')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    return this.courseModel.findById(id).exec();
  }

  async findCourseWithContent(id: string) {
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const content = await this.courseContentModel
      .findOne({ courseId: id, isActive: true })
      .sort({ version: -1 })
      .exec();

    return {
      ...course.toObject(),
      curriculum: content?.content || [],
    };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    return this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true, runValidators: true })
      .exec();
  }

  async updateContent(id: string, updateContentDto: UpdateCourseContentDto) {
    const currentContent = await this.courseContentModel
      .findOne({ courseId: id, isActive: true })
      .exec();

    if (currentContent) {
      currentContent.content = updateContentDto.content;
      currentContent.version = (currentContent.version || 1) + 1;
      return currentContent.save();
    }

    // No existing content — create the first version
    const newContent = new this.courseContentModel({
      courseId: id,
      content: updateContentDto.content,
      version: 1,
    });
    return newContent.save();
  }

  async publish(id: string) {
    return this.courseModel
      .findByIdAndUpdate(
        id,
        {
          status: 'published',
          publishedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async remove(id: string): Promise<any> {
    const result = await this.courseModel.deleteOne({ _id: id }).exec();
    await this.courseContentModel.deleteMany({ courseId: id }).exec();
    return result;
  }

  async incrementViews(id: string) {
    return this.courseModel
      .findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true })
      .exec();
  }

  // Recursive finder for lecture in nested content
  private findLectureInContent(nodes: any[], lectureId: string): any {
    if (!nodes) return null;
    for (const node of nodes) {
      if (node.id === lectureId) return node;
      if (node.children) {
        const found = this.findLectureInContent(node.children, lectureId);
        if (found) return found;
      }
    }
    return null;
  }

  async generateSecureTicket(courseId: string, lectureId: string, userAuth: any) {
    // 1. Verify Enrollment or Instructor status
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const isInstructor = course.createdBy.toString() === userAuth.userId;
    const isAdmin = userAuth.role === 'admin';

    if (!isInstructor && !isAdmin) {
      const isEnrolled = await this.enrollmentModel.findOne({
        courseId,
        userId: userAuth.userId,
        status: 'active',
      }).exec();

      if (!isEnrolled) {
        throw new ForbiddenException('You must be enrolled in this course to view documents');
      }
    }

    // 2. Locate lecture to ensure it exists
    const courseContentObj = await this.courseContentModel
      .findOne({ courseId, isActive: true })
      .sort({ version: -1 })
      .exec();

    if (!courseContentObj) {
      throw new NotFoundException('Course curriculum not found');
    }

    const lecture = this.findLectureInContent(courseContentObj.content, lectureId);
    if (!lecture || lecture.data?.type !== 'document') {
      throw new NotFoundException('Document not found for this lecture');
    }

    // 3. Generate HMAC Ticket
    const timestamp = Date.now();
    const payload = `${userAuth.userId}:${courseId}:${lectureId}:${timestamp}`;
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    return {
      ticket: signature,
      timestamp,
    };
  }

  async getSecureDocument(courseId: string, lectureId: string, userAuth: any, ticket: string, t: string) {
    // 1. Validate Ticket Expiration (15 seconds)
    const timestamp = parseInt(t, 10);
    if (isNaN(timestamp)) {
      throw new ForbiddenException('Invalid timestamp');
    }
    
    if (Date.now() - timestamp > 15000) {
      throw new ForbiddenException('Secure ticket expired. Please refresh the page.');
    }

    // 2. Validate HMAC Signature
    const payload = `${userAuth.userId}:${courseId}:${lectureId}:${timestamp}`;
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    if (ticket !== expectedSignature) {
      throw new ForbiddenException('Invalid secure ticket signature');
    }

    // 3. Fetch Curriculum
    const courseContentObj = await this.courseContentModel
      .findOne({ courseId, isActive: true })
      .sort({ version: -1 })
      .exec();

    if (!courseContentObj) {
      throw new NotFoundException('Course curriculum not found');
    }

    const lecture = this.findLectureInContent(courseContentObj.content, lectureId);
    if (!lecture || lecture.data?.type !== 'document') {
      throw new NotFoundException('Document not found for this lecture');
    }

    const contentUrl = lecture.data.content;
    if (!contentUrl) {
      throw new NotFoundException('No file attached to this lecture');
    }

    // Attempt to extract the S3 key from the contentUrl assuming it's an S3 public URL or just the key
    // Example: https://bucket.s3.region.amazonaws.com/documents/xxx.pdf => documents/xxx.pdf
    let key = contentUrl;
    try {
        if (contentUrl.includes('amazonaws.com/')) {
            key = contentUrl.split('amazonaws.com/')[1];
        } 
        
        if (key.includes('?')) {
            // Remove query parameters if it's a signed url or has other params
            key = key.split('?')[0];
        }

        // If it's a full URL and we still have the protocol, try to extract just the path
        if (key.startsWith('http')) {
            const u = new URL(key);
            key = u.pathname.substring(1); 
        }
    } catch (e) {
        // Fallback to original contentUrl if URL parsing fails
        key = contentUrl;
    }

    // Decode URL-encoded keys (important for filenames with spaces/special characters)
    key = decodeURIComponent(key);

    const pdfBuffer = await this.uploadsService.getFileBuffer(key);
    
    // Load and watermark
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const watermarkText = userAuth?.email || 'Student';

    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText(watermarkText, {
        x: width / 4,
        y: height / 2,
        size: 50,
        color: rgb(0.75, 0.75, 0.75),
        rotate: degrees(-45),
        opacity: 0.3,
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    return Buffer.from(modifiedPdfBytes);
  }
}
