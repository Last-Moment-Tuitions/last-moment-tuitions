import { IsArray, IsString } from 'class-validator';

export class SyncCartDto {
  @IsArray()
  @IsString({ each: true })
  course_ids: string[];
}
