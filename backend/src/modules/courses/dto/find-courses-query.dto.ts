import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindCoursesQueryDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(['draft', 'published', 'archived'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
