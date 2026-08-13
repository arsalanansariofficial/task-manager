import type { MongoServerError } from 'mongodb';

import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import z from 'zod';

import { env } from '@/lib/config';

export function isMongoServerError(error: Error): error is MongoServerError {
  return error.name === 'MongoServerError';
}

export async function hashPassword(payload: string) {
  return await bcrypt.hash(payload, env.SALT);
}

export const _id = z.union([
  z.instanceof(Types.ObjectId, { error: '_id should be instance of ObjectId' }),
  z.string({ error: '_id should be valid.' })
]);
