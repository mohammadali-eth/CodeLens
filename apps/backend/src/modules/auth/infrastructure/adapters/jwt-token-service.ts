import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload, ITokenService } from '../../application/ports/token-service.interface';

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: ITokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string): Promise<ITokenPayload> {
    return this.jwtService.verifyAsync<ITokenPayload>(token);
  }
}
