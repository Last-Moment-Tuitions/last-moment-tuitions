import { IsString, IsNotEmpty, IsArray, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateTestimonialDto {
    @IsString() @IsNotEmpty()
    name: string;

    @IsString() @IsOptional()
    image: string;

    @IsNumber() @Min(1) @Max(5)
    rating: number;

    @IsString() @IsNotEmpty()
    message: string;

    @IsArray() @IsString({ each: true })
    target_pages: string[];
}