import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, MaxLength, IsMongoId } from 'class-validator';

export class UpdatePageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    @IsOptional()
    title?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    slug?: string;

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

    @IsArray()
    @IsOptional()
    gjsAssets?: any[];

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
