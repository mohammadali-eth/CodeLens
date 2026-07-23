import { IsNotEmpty, IsString } from 'class-validator';

/**
 * RefreshTokenDto
 * Purpose: Data Transfer Object for token rotation calls.
 * Responsibilities: Enforces client payload validation for token rotation requests.
 * Dependencies: class-validator.
 */
export class RefreshTokenDto {
  @IsString({ message: 'Refresh token must be a string' })
  @IsNotEmpty({ message: 'Refresh token string is required' })
  refreshToken!: string;
}
