import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../domain/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface RequestWithUserPayload {
  user?: {
    sub?: string;
    role?: UserRole;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUserPayload>();
    const user = request.user;
    if (!user || !user.role) {
      return false;
    }

    const userRole = user.role;

    // Strict role hierarchy definitions
    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.USER]: 1,
      [UserRole.ADMIN]: 2,
    };

    const userWeight = roleHierarchy[userRole] || 0;

    return requiredRoles.some(
      (role) => userWeight >= (roleHierarchy[role] || 0),
    );
  }
}
