import type { MongoServerError } from 'mongodb';

import bcrypt from 'bcryptjs';

import { env } from '@/lib/config';

export function isMongoServerError(error: Error): error is MongoServerError {
  return error.name === 'MongoServerError';
}

export async function hashPassword(payload: string) {
  return await bcrypt.hash(payload, env.SALT);
}
