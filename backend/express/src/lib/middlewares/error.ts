import type { NextFunction, Response, Request } from 'express';

import { ZodError } from 'zod';

import type { Err } from '@/lib/util/types';

import { ApiError } from '@/lib/error';

import { isMongoServerError } from '../util';

export function error(
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
) {
  console.dir(error);
  let apiError: ApiError;

  if (error instanceof ApiError)
    return response.status(error.status).json(error);

  if (error instanceof ZodError) {
    apiError = new ApiError(
      error.issues.map(issue => ({
        message: issue.message,
        path: issue.path
      })) as [Err, ...Array<Err>],
      error.name,
      400
    );

    return response.status(apiError.status).json(apiError);
  }

  if (isMongoServerError(error) && error.code === 11000) {
    const apiError = new ApiError(
      Object.entries(error.keyValue ?? {}).map(([key, value]) => ({
        message: `${value} already exists`,
        path: [key]
      })) as [Err, ...Err[]],
      'Duplicate key',
      400
    );

    return response.status(apiError.status).json(apiError);
  }

  apiError = new ApiError(
    [{ message: 'An unknown error occurred.', path: [request.path] }],
    error.message
  );

  return response.status(apiError.status).json(apiError);
}
