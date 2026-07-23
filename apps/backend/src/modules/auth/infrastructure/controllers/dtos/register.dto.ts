import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../../domain/user-role.enum';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserRole, { message: 'Role must be USER or ADMIN' })
  @IsOptional()
  role?: string;
}
