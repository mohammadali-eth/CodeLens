import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ITokenService } from '../../application/ports/token-service.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(ITokenService)
    private readonly tokenService: ITokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: any }>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      // Fallback guest user context for demo/playground workspace code reviews
      request['user'] = {
        sub: '0850c06b-d8ff-41c2-8978-ce1df3d83f6f',
        email: 'guest@codelens.ai',
        role: 'GUEST',
      };
      return true;
    }

    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      if (!payload) {
        request['user'] = {
          sub: '0850c06b-d8ff-41c2-8978-ce1df3d83f6f',
          email: 'guest@codelens.ai',
          role: 'GUEST',
        };
        return true;
      }
      request['user'] = payload;
    } catch {
      request['user'] = {
        sub: '0850c06b-d8ff-41c2-8978-ce1df3d83f6f',
        email: 'guest@codelens.ai',
        role: 'GUEST',
      };
      return true;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
