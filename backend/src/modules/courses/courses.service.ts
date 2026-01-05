import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateCourseContentDto } from './dto/update-course-content.dto';
import { Course, CourseDocument } from './entities/course.entity';
import { CourseContent, CourseContentDocument } from './entities/course-content.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(CourseContent.name) private courseContentModel: Model<CourseContentDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto, userId: string) {
    // Create course
    const courseData = {
      ...createCourseDto,
      created_by: userId,
    };
    const createdCourse = new this.courseModel(courseData);
    const savedCourse = await createdCourse.save();

    // Create empty course content document
    const courseContent = new this.courseContentModel({
      course_id: savedCourse._id,
      version: 1,
      content: [],
    });
    await courseContent.save();

    return savedCourse;
  }

  async findAll(query: any) {
    const { category, status, created_by, search } = query;
    const filter: any = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (created_by) filter.created_by = created_by;
    if (search) {
      filter.$text = { $search: search };
    }

    return this.courseModel
      .find(filter)
      .select('-__v')
      .sort({ updated_at: -1 })
      .exec();
  }

  async findOne(id: string) {
    return this.courseModel.findById(id).exec();
  }

  async findCourseWithContent(id: string) {
    const course = await this.courseModel.findById(id).exec();
    const content = await this.courseContentModel
      .findOne({ course_id: id, is_active: true })
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
    // Find current content
    const currentContent = await this.courseContentModel
      .findOne({ course_id: id, is_active: true })
      .exec();

    if (currentContent) {
      // Update existing content
      currentContent.content = updateContentDto.content;
      currentContent.version = (currentContent.version || 1) + 1;
      return currentContent.save();
    } else {
      // Create new content
      const newContent = new this.courseContentModel({
        course_id: id,
        content: updateContentDto.content,
        version: 1,
      });
      return newContent.save();
    }
  }

  async publish(id: string) {
    return this.courseModel
      .findByIdAndUpdate(
        id,
        {
          status: 'published',
          published_at: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async remove(id: string) {
    // Remove course
    const result = await this.courseModel.deleteOne({ _id: id }).exec();
    
    // Remove associated content
    await this.courseContentModel.deleteMany({ course_id: id }).exec();
    
    return result;
  }

  async incrementViews(id: string) {
    return this.courseModel
      .findByIdAndUpdate(id, { $inc: { view_count: 1 } }, { new: true })
      .exec();
  }
}
