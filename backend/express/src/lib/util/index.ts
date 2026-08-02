import bcrypt from 'bcryptjs';

import { env } from '@/lib/config';

export async function hashPassword(payload: string) {
  return await bcrypt.hash(payload, env.SALT);
}
