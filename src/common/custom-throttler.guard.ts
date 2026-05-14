import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { IS_INTERNAL_KEY } from './decorators/internal.decorator';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {

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

    // 🔐 Só ignora se for rota interna E chave válida
    if (isInternal && key === process.env.INTERNAL_API_KEY) {
      return true;
    }

    // 🚫 todo o resto passa pelo rate limit
    return super.canActivate(context);
  }
}