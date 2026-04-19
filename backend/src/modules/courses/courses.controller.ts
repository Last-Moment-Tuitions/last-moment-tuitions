import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateCourseContentDto } from './dto/update-course-content.dto';
import { FindCoursesQueryDto } from './dto/find-courses-query.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createCourseDto: CreateCourseDto, @Req() req: any) {
    const userId = req.user.userId;
    const course = await this.coursesService.create(createCourseDto, userId);
    return { success: true, data: course };
  }

  @Get()
  async findAll(@Query() query: FindCoursesQueryDto) {
    const courses = await this.coursesService.findAll(query);
    return { success: true, data: courses, total: courses.length };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const course = await this.coursesService.findOne(id);
    if (!course) throw new NotFoundException('Course not found');
    return { success: true, data: course };
  }

  @Get(':id/full')
  async findFullCourse(@Param('id') id: string) {
    const course = await this.coursesService.findCourseWithContent(id);
    if (!course) throw new NotFoundException('Course not found');
    return { success: true, data: course };
  }

  @Post(':id/lecture/:lectureId/secure-ticket')
  @UseGuards(AuthGuard)
  async getSecureTicket(
    @Param('id') id: string,
    @Param('lectureId') lectureId: string,
    @Req() req: any,
  ) {
    const data = await this.coursesService.generateSecureTicket(id, lectureId, req.user);
    return { success: true, data };
  }

  @Get(':id/lecture/:lectureId/secure-document')
  @UseGuards(AuthGuard)
  async getSecureDocument(
    @Param('id') id: string,
    @Param('lectureId') lectureId: string,
    @Query('ticket') ticket: string,
    @Query('t') t: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    if (!ticket || !t) {
      throw new NotFoundException('Security parameters missing');
    }
    const buffer = await this.coursesService.getSecureDocument(id, lectureId, req.user, ticket, t);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="secure-document.pdf"',
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    const course = await this.coursesService.update(id, updateCourseDto);
    if (!course) throw new NotFoundException('Course not found');
    return { success: true, data: course };
  }

  @Patch(':id/content')
  @UseGuards(AuthGuard)
  async updateContent(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateCourseContentDto,
  ) {
    const content = await this.coursesService.updateContent(id, updateContentDto);
    return { success: true, data: content };
  }

  @Patch(':id/publish')
  @UseGuards(AuthGuard)
  async publish(@Param('id') id: string) {
    const course = await this.coursesService.publish(id);
    if (!course) throw new NotFoundException('Course not found');
    return { success: true, data: course };
  }

  @Post(':id/view')
  async incrementViews(@Param('id') id: string) {
    const course = await this.coursesService.incrementViews(id);
    return { success: true, data: course };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    const result = await this.coursesService.remove(id);
    if (result.deletedCount === 0) throw new NotFoundException('Course not found');
    return { success: true, message: 'Course deleted successfully' };
  }
}
