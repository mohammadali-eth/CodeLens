import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../ports/user-repository.interface';
import { IPasswordHasher } from '../ports/password-hasher.interface';
import { User } from '../../domain/user.entity';
import { UserRole } from '../../domain/user-role.enum';
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
    const id = crypto.randomUUID();

    const userRole = dto.role && Object.values(UserRole).includes(dto.role as UserRole)
      ? (dto.role as UserRole)
      : UserRole.USER;

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
      status: savedUser.status,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
      deletedAt: savedUser.deletedAt,
      isActive: savedUser.isActive.bind(savedUser),
      isDeleted: savedUser.isDeleted.bind(savedUser),
      canAuthenticate: savedUser.canAuthenticate.bind(savedUser),
      softDelete: savedUser.softDelete.bind(savedUser),
      updateStatus: savedUser.updateStatus.bind(savedUser),
      updateProfile: savedUser.updateProfile.bind(savedUser),
      updatePassword: savedUser.updatePassword.bind(savedUser),
    };
  }
}
