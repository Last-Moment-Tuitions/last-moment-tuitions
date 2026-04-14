import { IsMongoId } from 'class-validator';

export class AddToWishlistDto {
  @IsMongoId()
  course_id: string;
}
