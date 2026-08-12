import type { NextFunction, Response, Request } from 'express';

import { InvalidJwtError } from '@/lib/error';
import { User } from '@/modules/user/model';
import { Headers } from '@/lib/util/types';

export async function auth(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const auth = request.header(Headers.Authorization);
  if (!auth) throw new InvalidJwtError();

  const [scheme, token] = auth.split(' ');
  if (scheme !== Headers.Bearer || !token) throw new InvalidJwtError();

  const user = await User.validateCredentials({ token });

  request.token = token;
  request.user = user;
  next();
}
