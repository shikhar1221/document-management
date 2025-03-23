// guards/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { Role } from '../enums/roles.enum';
import { Permission } from '../enums/permissions.enum';

@Injectable()
export class JwtAuthGuard extends PassportAuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler()
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    // Check roles
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler()
    );
    if (requiredRoles) {
      const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));
      if (!hasRequiredRole) {
        throw new ForbiddenException('Insufficient role permissions');
      }
    }

    // Check permissions
    const requiredPermissions = this.reflector.get<Permission[]>(
      'permissions',
      context.getHandler()
    );
    if (requiredPermissions) {
      for (const permission of requiredPermissions) {
        if (!user.permissions[permission]) {
          throw new ForbiddenException('Insufficient permission');
        }
      }
    }

    return true;
  }
}