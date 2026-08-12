import {
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCodeFileDto {
  @IsString()
  @MinLength(1, { message: 'Filename cannot be empty' })
  filename!: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsString()
  content!: string;

  @IsString()
  @IsOptional()
  language?: string;
}

export class CreateReviewDto {
  @IsString()
  @MinLength(3, { message: 'Review title must be at least 3 characters' })
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  repository?: string;

  @IsString()
  @IsOptional()
  branch?: string;

  @IsString()
  @IsOptional()
  aiProvider?: string;

  @IsString()
  @IsOptional()
  aiModel?: string;

  @IsString()
  @IsOptional()
  analysisDepth?: string;

  @IsString()
  @IsOptional()
  workspaceId?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one code file is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateCodeFileDto)
  files!: CreateCodeFileDto[];
}
