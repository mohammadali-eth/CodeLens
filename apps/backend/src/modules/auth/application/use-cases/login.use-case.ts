import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../ports/user-repository.interface';
import { IPasswordHasher } from '../ports/password-hasher.interface';
import { ITokenService } from '../ports/token-service.interface';
import { LoginDto } from '../../infrastructure/controllers/dtos/login.dto';

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(ITokenService)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.tokenService.generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
