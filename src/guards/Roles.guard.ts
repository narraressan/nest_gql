import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRoleEnum } from 'src/db/entities/Base';

export const UserRoles = (...roles: UserRoleEnum[]) =>
  SetMetadata('roles', roles);

@Injectable()
export class UserRolesGQLGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRoleEnum[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) return true;

    const host = GqlExecutionContext.create(context);
    const gqlContext = host.getContext();
    const user = gqlContext.req.user;
    return roles.includes(user.role);
  }
}
