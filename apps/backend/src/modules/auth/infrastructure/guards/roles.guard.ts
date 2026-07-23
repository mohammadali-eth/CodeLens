import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../domain/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.role) {
      return false;
    }

    const userRole = user.role as Role;

    // Strict role hierarchy definitions
    const roleHierarchy: Record<Role, number> = {
      [Role.DEV]: 1,
      [Role.LEAD]: 2,
      [Role.ADMIN]: 3,
    };

    const userWeight = roleHierarchy[userRole] || 0;

    return requiredRoles.some((role) => userWeight >= roleHierarchy[role]);
  }
}
