import type { NextFunction, Response, Request } from 'express';

import bcrypt from 'bcryptjs';

import { InvalidCredentialsError, InvalidJwtError } from '@/lib/error';
import { UserModel } from '@/modules/models/user';
import { verifyToken } from '@/lib/token';
import { Headers } from '@/lib/util';

export async function validateCredentials({
  password,
  email,
  token
}: {
  password?: string;
  email?: string;
  token?: string;
}) {
  const { _id } = (token && verifyToken(token)) || { _id: undefined };
  const error = new InvalidCredentialsError();
  const [errors] = error.errors;

  const user = await UserModel.findOne({
    $or: [{ 'tokens.token': token, _id }, { email }]
  });

  if (!user) {
    errors.path = [token, email, _id].filter((v): v is string => Boolean(v));
    throw error;
  }

  const { password: originalPassword, ...userWithoutPassword } = user;
  if (password && !(await bcrypt.compare(password, originalPassword))) {
    errors.path = [password, email].filter((v): v is string => Boolean(v));
    throw error;
  }

  return userWithoutPassword;
}

export default async function auth(
  request: { user: Record<string, unknown>; token: string } & Request,
  _response: Response,
  next: NextFunction
) {
  const auth = request.header(Headers.Authorization);
  if (!auth) throw new InvalidJwtError();

  const [scheme, token] = auth.split(' ');
  if (scheme !== Headers.Bearer || !token) throw new InvalidJwtError();

  const user = await validateCredentials({ token });

  request.token = token;
  request.user = user;
  next();
}
