import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum, IsMongoId } from 'class-validator';

export class CreatePageDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsOptional()
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

    @IsString()
    @IsOptional()
    @IsEnum(['page', 'template'])
    type?: string;

    @IsString()
    @IsOptional()
    @IsEnum(['draft', 'published', 'archived'])
    status?: string;

    @IsMongoId()
    @IsOptional()
    folder?: string;
}
