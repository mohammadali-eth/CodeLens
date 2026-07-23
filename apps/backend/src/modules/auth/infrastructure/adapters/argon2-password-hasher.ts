import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { IPasswordHasher } from '../../application/ports/password-hasher.interface';

/**
 * Argon2PasswordHasher Adapter
 * Purpose: Secure password hashing infrastructure service.
 * Responsibilities: Performs Argon2id password hashing and comparison.
 * Dependencies: argon2 library, IPasswordHasher interface.
 */
@Injectable()
export class Argon2PasswordHasher implements IPasswordHasher {
  // Argon2id configuration per OWASP security guidelines
  async hash(plainText: string): Promise<string> {
    return await argon2.hash(plainText, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plainText);
    } catch {
      return false;
    }
  }
}
