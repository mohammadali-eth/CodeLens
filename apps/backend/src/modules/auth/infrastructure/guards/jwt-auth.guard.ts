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
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      if (!payload) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
