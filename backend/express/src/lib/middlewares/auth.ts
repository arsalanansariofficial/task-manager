import type { NextFunction, Response, Request } from 'express';

import { compare } from 'bcryptjs';

import { InvalidCredentialsError, InvalidJwtError } from '@/lib/error';
import { User } from '@/modules/user/model';
import { Headers } from '@/lib/util/types';
import { verifyToken } from '@/lib/token';

export async function validateCredentials({
  password,
  email,
  token
}: {
  password?: string;
  email?: string;
  token?: string;
}) {
  const { id } = (token && verifyToken(token)) || { id: undefined };
  const error = new InvalidCredentialsError();
  const [errors] = error.errors;

  const user = await User.findOne({
    $or: [{ 'tokens.token': token, id }, { email }]
  });

  if (!user) {
    errors.path = [token, email, id].filter((v): v is string => Boolean(v));
    throw error;
  }

  const { password: originalPassword, ...userWithoutPassword } = user;
  if (password && !(await compare(password, originalPassword))) {
    errors.path = [password, email].filter((v): v is string => Boolean(v));
    throw error;
  }

  return userWithoutPassword;
}

export async function auth(
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
