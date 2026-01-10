import { IsString, IsOptional, IsArray, IsNumber, IsEnum, MaxLength, IsNotEmpty, IsObject } from 'class-validator';

export class CreateCourseDto {
  // BASIC INFORMATION - Required
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  // BASIC INFORMATION - Optional
  @IsString()
  @IsOptional()
  @MaxLength(120)
  subtitle?: string;

  @IsString()
  @IsOptional()
  sub_category?: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  // ADVANCED INFORMATION
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  trailer?: string;

  @IsString()
  @IsOptional()
  descriptions?: string;

  @IsArray()
  @IsOptional()
  what_to_learn?: string[];

  @IsArray()
  @IsOptional()
  target_audience?: string[];

  @IsArray()
  @IsOptional()
  requirements?: string[];

  @IsArray()
  @IsOptional()
  tags?: string[];

  // PUBLISH COURSE
  @IsString()
  @IsOptional()
  welcome_message?: string;

  @IsString()
  @IsOptional()
  congratulations_message?: string;

  @IsArray()
  @IsOptional()
  instructor_ids?: string[];

  @IsObject()
  @IsOptional()
  instructor?: {
    name: string;
    role: string;
    image: string;
    bio: string;
  };

  // PRICING
  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  original_price?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(['draft', 'published', 'archived'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  last_updated?: string;
}
