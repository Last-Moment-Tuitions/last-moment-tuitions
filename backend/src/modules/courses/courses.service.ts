import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateCourseContentDto } from './dto/update-course-content.dto';
import { FindCoursesQueryDto } from './dto/find-courses-query.dto';
import { Course, CourseDocument } from './entities/course.entity';
import { CourseContent, CourseContentDocument } from './entities/course-content.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(CourseContent.name) private courseContentModel: Model<CourseContentDocument>,
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
}
