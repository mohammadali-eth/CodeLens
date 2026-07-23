import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../ports/user-repository.interface';
import { IPasswordHasher } from '../ports/password-hasher.interface';
import { User } from '../../domain/user.entity';
import { Role } from '../../domain/role.enum';
import { RegisterDto } from '../../infrastructure/controllers/dtos/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    
    // Auto-generate UUID or let database handle it. Since we are in clean architecture, we can let database or generator handle it.
    // For now we'll pass an empty string and let repository adapter populate it, or generate one.
    // Let's import uuid to generate ID inside the domain or let the adapter handle it. Generating here is more domain-friendly.
    // We can use standard crypto.randomUUID() which is built into Node.js! That requires no external packages!
    const id = crypto.randomUUID();
    
    const userRole = dto.role && Object.values(Role).includes(dto.role as Role)
      ? (dto.role as Role)
      : Role.DEV;

    const user = User.create(
      id,
      dto.email,
      passwordHash,
      dto.name || null,
      userRole,
    );

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
      hasRole: savedUser.hasRole.bind(savedUser),
    };
  }
}
