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
  subCategory?: string;

  @IsString()
  @IsOptional()
  topic?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  subtitleLanguage?: string;

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
  whatToLearn?: string[];

  @IsArray()
  @IsOptional()
  targetAudience?: string[];

  @IsArray()
  @IsOptional()
  requirements?: string[];

  @IsArray()
  @IsOptional()
  tags?: string[];

  // PUBLISH COURSE
  @IsString()
  @IsOptional()
  welcomeMessage?: string;

  @IsString()
  @IsOptional()
  congratulationsMessage?: string;

  @IsArray()
  @IsOptional()
  instructorIds?: string[];

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
  originalPrice?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(['draft', 'published', 'archived'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  lastUpdated?: string;
}
