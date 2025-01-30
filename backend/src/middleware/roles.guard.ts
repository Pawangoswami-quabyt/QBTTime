import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // No role specified, allow access
    }
      const { user } = context.switchToHttp().getRequest();

      if (!user || !user.role) {
          throw new ForbiddenException('Unauthorized');
      }

     if (requiredRoles.includes(user.role)) {
         return true
     }
       throw new ForbiddenException('Forbidden');
  }
}