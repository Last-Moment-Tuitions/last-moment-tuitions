import { IsArray, IsOptional } from 'class-validator';

export class UpdateCourseContentDto {
  @IsArray()
  @IsOptional()
  content?: any[]; // Nested structure

  @IsOptional()
  version?: number;
}
