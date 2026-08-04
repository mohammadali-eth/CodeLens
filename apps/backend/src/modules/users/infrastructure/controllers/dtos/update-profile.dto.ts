import { IsOptional, IsString, MaxLength, MinLength, IsEmail, Matches, IsUrl } from 'class-validator';

/**
 * UpdateProfileDto
 * Purpose: Data Transfer Object for profile update requests.
 * Responsibilities: Validates optional profile attributes for self-service updates.
 * Dependencies: class-validator.
 */
export class UpdateProfileDto {
  @IsString({ message: 'Name must be a valid string' })
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  name?: string;

  @IsString({ message: 'Username must be a valid string' })
  @IsOptional()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(30, { message: 'Username cannot exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain alphanumeric characters, underscores, and hyphens' })
  username?: string;

  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
  bio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Company cannot exceed 100 characters' })
  company?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Location cannot exceed 100 characters' })
  location?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  timeZone?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  dateFormat?: string;

  @IsString()
  @IsOptional()
  timeFormat?: string;
}
