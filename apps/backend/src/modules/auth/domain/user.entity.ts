import { Role } from './role.enum';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly name: string | null,
    public readonly role: Role,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validateEmail(email);
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  public hasRole(requiredRole: Role): boolean {
    const roleHierarchy: Record<Role, number> = {
      [Role.DEV]: 1,
      [Role.LEAD]: 2,
      [Role.ADMIN]: 3,
    };
    return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
  }

  public static create(
    id: string,
    email: string,
    passwordHash: string,
    name: string | null,
    role: Role = Role.DEV,
  ): User {
    return new User(
      id,
      email,
      passwordHash,
      name,
      role,
      new Date(),
      new Date(),
    );
  }
}
