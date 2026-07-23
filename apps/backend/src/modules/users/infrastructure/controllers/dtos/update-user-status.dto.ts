import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../../../../auth/domain/user-status.enum';

/**
 * UpdateUserStatusDto
 * Purpose: Data Transfer Object for administrative user state updates.
 * Responsibilities: Enforces valid status transitions for tenant administration.
 * Dependencies: class-validator, UserStatus.
 */
export class UpdateUserStatusDto {
  @IsEnum(UserStatus, { message: 'Status must be ACTIVE, INACTIVE, PENDING_VERIFICATION, SUSPENDED, or DELETED' })
  @IsNotEmpty({ message: 'Status is required' })
  status!: UserStatus;
}
