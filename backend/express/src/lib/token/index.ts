import { verify, sign } from 'jsonwebtoken';

import { InvalidJwtError } from '@/lib/error';
import { env } from '@/lib/config';

export function verifyToken(payload: string) {
  try {
    return verify(payload, env.JWT_SECRET) as { id: string };
  } catch (error: unknown) {
    throw new InvalidJwtError([
      { message: (error as Error).message, path: [payload] }
    ]);
  }
}

export function hasValidAuthentication(value: unknown) {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'tokens' in value &&
    Array.isArray(value.tokens)
  );
}

export function generateToken(payload: string, expiresIn = env.JWT_EXPIRES_IN) {
  return sign({ id: payload }, env.JWT_SECRET, { expiresIn });
}

export function hasSuccess(value: unknown) {
  return Boolean(
    value && value instanceof Object && 'success' in value && value.success
  );
}
