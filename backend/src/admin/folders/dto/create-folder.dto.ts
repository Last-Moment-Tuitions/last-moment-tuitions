import { IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength, IsMongoId } from 'class-validator';

export class CreateFolderDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @IsMongoId()
    @IsOptional()
    parent?: string;

    @IsEnum(['page', 'template'])
    @IsOptional()
    type?: 'page' | 'template';
}
