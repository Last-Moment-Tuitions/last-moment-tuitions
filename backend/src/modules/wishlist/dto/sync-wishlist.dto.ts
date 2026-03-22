import { IsArray, IsMongoId } from 'class-validator';

export class SyncWishlistDto {
  @IsArray()
  @IsMongoId({ each: true })
  course_ids: string[];
}
