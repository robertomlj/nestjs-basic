import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/modules/auth/roles/role.enum';

@Injectable()
export class UpdateMySelfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user, params } = context.switchToHttp().getRequest();

    if (!params && !user) {
      return true;
    }

    if (!user.roles?.includes(Role.Admin)) {
      return parseInt(user.id) === parseInt(params.id);
    }

    return true;
  }
}
