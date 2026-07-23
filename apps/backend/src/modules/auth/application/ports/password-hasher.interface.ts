/**
 * IPasswordHasher Port
 * Purpose: Decouples domain authentication from specific password hashing libraries (Argon2 / Bcrypt).
 * Responsibilities: Defines async contracts for password hashing and verification.
 * Dependencies: None.
 */
export interface IPasswordHasher {
  hash(plainText: string): Promise<string>;
  compare(plainText: string, hash: string): Promise<boolean>;
}

export const IPasswordHasher = Symbol('IPasswordHasher');
