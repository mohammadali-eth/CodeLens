import { IsString, MinLength, IsOptional, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCodeFileDto {
  @IsString()
  @MinLength(1, { message: 'Filename cannot be empty' })
  filename!: string;

  @IsString()
  content!: string;
}

export class CreateReviewDto {
  @IsString()
  @MinLength(3, { message: 'Review title must be at least 3 characters' })
  title!: string;

  @IsString()
  repository!: string;

  @IsString()
  @IsOptional()
  branch?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one code file is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateCodeFileDto)
  files!: CreateCodeFileDto[];
}
