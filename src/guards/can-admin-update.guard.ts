import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PROPERTIES_KEY } from 'src/decorators/can-admin-update.decorator';

@Injectable()
export class CanUpdate implements CanActivate {
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

    properties.map((property) => {
      if (!user.roles?.includes('admin')) {
        return false;
      }
    });

    return true;
  }
}
