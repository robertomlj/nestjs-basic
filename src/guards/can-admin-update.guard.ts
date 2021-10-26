import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PROPERTIES_KEY } from 'src/decorators/can-admin-update.decorator';
import { Role } from 'src/modules/auth/roles/role.enum';

@Injectable()
export class CanAdminUpdateGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const properties = this.reflector.getAllAndOverride<string[]>(
      PROPERTIES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!properties) {
      return true;
    }

    const { body } = context.switchToHttp().getRequest();
    const { user } = context.switchToHttp().getRequest();

    const exists = properties.some((property) => body[property] !== undefined);

    if (exists) {
      return user.roles?.includes(Role.Admin) ? true : false;
    }

    return true;
  }
}
