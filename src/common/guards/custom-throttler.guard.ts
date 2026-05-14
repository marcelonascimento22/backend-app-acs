// src/common/guards/custom-throttler.guard.ts
import { ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ThrottlerGuard,
  type ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { IS_INTERNAL_KEY } from '../decorators/internal.decorator';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(
    @Inject('THROTTLER_OPTIONS') options: ThrottlerModuleOptions,
    @Inject('THROTTLER_STORAGE') storageService: ThrottlerStorage,
    protected readonly reflector: Reflector,
  ) {
    super(options, storageService, reflector);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.user?.id ? `user-${req.user.id}` : `ip-${req.ip}`;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isInternal = this.reflector.getAllAndOverride<boolean>(
      IS_INTERNAL_KEY,
      [context.getHandler(), context.getClass()],
    );

    const key = request.headers['x-internal-key'];

    // 🔐 bypass SOMENTE se for rota interna + chave correta
    if (isInternal && key === process.env.INTERNAL_API_KEY) {
      return true;
    }

    // 🔥 todo o resto passa pelo throttler
    return super.canActivate(context);
  }
}