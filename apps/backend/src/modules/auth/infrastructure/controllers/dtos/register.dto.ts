import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../../domain/role.enum';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(Role, { message: 'Role must be DEV, LEAD, or ADMIN' })
  @IsOptional()
  role?: string;
}
