import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './infrastructure/controllers/users.controller';
import { AdminUsersController } from './infrastructure/controllers/admin-users.controller';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from './application/use-cases/update-user-profile.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { AdminListUsersUseCase } from './application/use-cases/admin-list-users.use-case';
import { AdminUpdateUserStatusUseCase } from './application/use-cases/admin-update-user-status.use-case';
import { AdminSoftDeleteUserUseCase } from './application/use-cases/admin-soft-delete-user.use-case';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [UsersController, AdminUsersController],
  providers: [
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    ChangePasswordUseCase,
    AdminListUsersUseCase,
    AdminUpdateUserStatusUseCase,
    AdminSoftDeleteUserUseCase,
  ],
  exports: [
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    ChangePasswordUseCase,
  ],
})
export class UsersModule {}
