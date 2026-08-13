import { verify, sign } from 'jsonwebtoken';

import { InvalidJwtError } from '@/lib/error';
import { env } from '@/lib/config';

export function verifyToken(payload: string) {
  try {
    return verify(payload, env.JWT_SECRET) as { _id: string };
  } catch (error: unknown) {
    throw new InvalidJwtError([
      { message: (error as Error).message, path: [payload] }
    ]);
  }
}

export function generateToken(payload: string, expiresIn = env.JWT_EXPIRES_IN) {
  return sign({ _id: payload }, env.JWT_SECRET, { expiresIn });
}
