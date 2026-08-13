import z from 'zod';

import type { UserDocument } from '@/modules/user/model';

declare module 'express-serve-static-core' {
  interface Request {
    user: UserDocument;
    token: string;
  }
}

export enum HttpStatusCodes {
  internalServerError = 500,
  unAuthenticated = 401,
  badRequest = 400,
  created = 201,
  ok = 200
}

export enum Headers {
  Authorization = 'Authorization',
  Bearer = 'Bearer'
}

export type OptionalFields<T, K extends keyof T> = Partial<T> & Omit<T, K>;
export type RequireFields<T, K extends keyof T> = Required<Pick<T, K>> & T;
export type ModelType<T> = { [k in keyof T]: z.infer<T[k]> };
export type Err = { path: Array<string>; message: string };
