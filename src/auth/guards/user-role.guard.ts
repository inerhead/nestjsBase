import {
  BadGatewayException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from '../decorator/roles.enum';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const validRoles: string[] = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );
    if (!validRoles) throw new BadGatewayException('Roles not found for route');
    const user = request.user as User;
    const hasRole = () => user.roles.some((role) => validRoles.includes(role));
    console.log({ validRoles, user });

    if (hasRole() || validRoles?.length == 0) return true;

    throw new ForbiddenException(
      `You do not have permission to access this route, you need a valid role: ${validRoles}`,
    );
  }
}
