export interface ITokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface ITokenService {
  generateToken(payload: ITokenPayload): Promise<string>;
  verifyToken(token: string): Promise<ITokenPayload>;
}

export const ITokenService = Symbol('ITokenService');
