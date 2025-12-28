import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, MaxLength, IsMongoId } from 'class-validator';

export class CreatePageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsOptional()
    @MaxLength(160)
    metaDescription?: string;

    @IsArray()
    @IsOptional()
    gjsComponents?: any[];

    @IsArray()
    @IsOptional()
    gjsStyles?: any[];

    @IsString()
    @IsOptional()
    gjsHtml?: string;

    @IsString()
    @IsOptional()
    gjsCss?: string;

    @IsEnum(['page', 'template'])
    @IsOptional()
    type?: 'page' | 'template';

    @IsEnum(['draft', 'published', 'archived'])
    @IsOptional()
    status?: string;

    @IsMongoId()
    @IsOptional()
    folder?: string;
}
