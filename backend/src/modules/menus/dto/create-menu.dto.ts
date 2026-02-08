import { IsString, IsEnum, IsOptional, ValidateNested, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class MenuItemDto {
  @IsString()
  label: string;

  @IsEnum(['link', 'dropdown'])
  type: string;

  @IsOptional()
  @IsString()
  href?: string;

  @IsOptional()
  @IsString()
  target?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items?: MenuItemDto[];
}

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items: MenuItemDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
