// guards/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Role } from '../enums/roles.enum';
import { Permission } from '../enums/permissions.enum';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends PassportAuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService
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
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const user = await this.authService.validateUserWithToken(token);
      request.user = user;

      // // Check roles
      // const requiredRoles = this.reflector.get<Role[]>(
      //   'roles',
      //   context.getHandler()
      // );
      // if (requiredRoles) {
      //   if (!user.roles) {
      //     throw new ForbiddenException('User roles not found');
      //   }
      //   const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));
      //   if (!hasRequiredRole) {
      //     throw new ForbiddenException('Insufficient role permissions');
      //   }
      // }

      // // Check permissions
      // const requiredPermissions = this.reflector.get<Permission[]>(
      //   'permissions',
      //   context.getHandler()
      // );
      // if (requiredPermissions) {
      //   if (!user.permissions) {
      //     throw new ForbiddenException('User permissions not found');
      //   }
      //   const hasRequiredPermission = requiredPermissions.every(permission => 
      //     user.permissions[permission] === true
      //   );
      //   if (!hasRequiredPermission) {
      //     throw new ForbiddenException('Insufficient permission');
      //   }
      // }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}