import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * UpdateProfileDto
 * Purpose: Data Transfer Object for profile update requests.
 * Responsibilities: Validates optional name attributes for self-service updates.
 * Dependencies: class-validator.
 */
export class UpdateProfileDto {
  @IsString({ message: 'Name must be a valid string' })
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  name?: string;
}
