import { Controller, Get, Patch, Delete, Param, Query, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { UserRole } from '../../../auth/domain/user-role.enum';
import { AdminListUsersUseCase } from '../../application/use-cases/admin-list-users.use-case';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case';
import { AdminUpdateUserStatusUseCase } from '../../application/use-cases/admin-update-user-status.use-case';
import { AdminSoftDeleteUserUseCase } from '../../application/use-cases/admin-soft-delete-user.use-case';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';

/**
 * AdminUsersController
 * Purpose: Presentation layer for tenant administration endpoints.
 * Responsibilities: Enforces ADMIN RBAC rules for user governance and status updates.
 * Dependencies: JwtAuthGuard, RolesGuard, Admin Use Cases.
 */
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUsersController {
  constructor(
    private readonly adminListUsersUseCase: AdminListUsersUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly adminUpdateUserStatusUseCase: AdminUpdateUserStatusUseCase,
    private readonly adminSoftDeleteUserUseCase: AdminSoftDeleteUserUseCase,
  ) {}

  @Get()
  async listUsers(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const takeNum = take ? parseInt(take, 10) : 20;
    return this.adminListUsersUseCase.execute(skipNum, takeNum);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.getUserProfileUseCase.execute(id);
  }

  @Patch(':id/status')
  async updateUserStatus(
    @Param('id') targetUserId: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminUpdateUserStatusUseCase.execute(targetUserId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') targetUserId: string) {
    return this.adminSoftDeleteUserUseCase.execute(targetUserId);
  }
}
