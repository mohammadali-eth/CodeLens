import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { IUserRepository } from './application/ports/user-repository.interface';
import { PrismaUserRepository } from './infrastructure/adapters/prisma-user-repository';
import { IRefreshTokenRepository } from './application/ports/refresh-token-repository.interface';
import { PrismaRefreshTokenRepository } from './infrastructure/adapters/prisma-refresh-token-repository';
import { IPasswordHasher } from './application/ports/password-hasher.interface';
import { Argon2PasswordHasher } from './infrastructure/adapters/argon2-password-hasher';
import { ITokenService } from './application/ports/token-service.interface';
import { JwtTokenService } from './infrastructure/adapters/jwt-token-service';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from './infrastructure/guards/roles.guard';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-for-codelens-platform-enterprise-version',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IRefreshTokenRepository,
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: IPasswordHasher,
      useClass: Argon2PasswordHasher,
    },
    {
      provide: ITokenService,
      useClass: JwtTokenService,
    },
  ],
  exports: [
    IUserRepository,
    IRefreshTokenRepository,
    IPasswordHasher,
    ITokenService,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
