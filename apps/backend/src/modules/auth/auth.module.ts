import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { IUserRepository } from './application/ports/user-repository.interface';
import { IPasswordHasher } from './application/ports/password-hasher.interface';
import { ITokenService } from './application/ports/token-service.interface';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { PrismaUserRepository } from './infrastructure/adapters/prisma-user-repository';
import { BcryptPasswordHasher } from './infrastructure/adapters/bcrypt-password-hasher';
import { JwtTokenService } from './infrastructure/adapters/jwt-token-service';
import { AuthController } from './infrastructure/controllers/auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-for-codelens-platform-enterprise-version',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IPasswordHasher,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: ITokenService,
      useClass: JwtTokenService,
    },
  ],
  exports: [
    RegisterUseCase,
    LoginUseCase,
    IUserRepository,
    IPasswordHasher,
    ITokenService,
  ],
})
export class AuthModule {}
