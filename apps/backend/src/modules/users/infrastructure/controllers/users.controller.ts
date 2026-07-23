import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';

/**
 * UsersController
 * Purpose: Presentation layer for user self-service account endpoints.
 * Responsibilities: Maps user profile and credential updates to corresponding Use Cases.
 * Dependencies: JwtAuthGuard, GetUserProfileUseCase, UpdateUserProfileUseCase, ChangePasswordUseCase.
 */
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Get('me')
  async getProfile(@CurrentUser('sub') userId: string) {
    return this.getUserProfileUseCase.execute(userId);
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.updateUserProfileUseCase.execute(userId, dto);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser('sub') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.changePasswordUseCase.execute(userId, dto);
  }
}
