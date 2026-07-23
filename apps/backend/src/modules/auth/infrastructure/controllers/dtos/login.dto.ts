import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * LoginDto
 * Purpose: Data Transfer Object for authentication credentials.
 * Responsibilities: Validates client payload before passing to LoginUseCase.
 * Dependencies: class-validator.
 */
export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address format' })
  @IsNotEmpty({ message: 'Email address is required' })
  email!: string;

  @IsString({ message: 'Password must be a valid string' })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
