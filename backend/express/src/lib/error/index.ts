import type { Err } from '@/lib/util/types';

export class ApiError extends Error {
  constructor(
    public errors: [Err, ...Array<Err>] = [
      { message: 'An unknown error occurred.', path: ['unknown'] }
    ],
    public override message = 'An unknown error occurred.',
    public status = 500
  ) {
    super();
  }
}

export class InvalidCredentialsError extends ApiError {
  constructor(
    public override errors: [Err, ...Array<Err>] = [
      {
        message: 'Either email or password is invalid.',
        path: ['email', 'password']
      }
    ],
    public override message = 'Invalid credentials.',
    public override status = 400
  ) {
    super();
  }
}

export class InvalidFileTypeError extends ApiError {
  constructor(
    public override errors: [Err, ...Array<Err>] = [
      { message: 'File should be valid image format.', path: ['image'] }
    ],
    public override message = 'Invalid image file type.',
    public override status = 401
  ) {
    super();
  }
}

export class UserNotFoundError extends ApiError {
  constructor(
    public override errors: [Err, ...Array<Err>] = [
      { message: 'User with the id does not exist.', path: ['id'] }
    ],
    public override message = 'User not found.',
    public override status = 400
  ) {
    super();
  }
}

export class InvalidJwtError extends ApiError {
  constructor(
    public override errors: [Err, ...Array<Err>] = [
      { message: 'Either jwt invalid or expired.', path: ['jwt'] }
    ],
    public override message = 'Invalid jwt.',
    public override status = 401
  ) {
    super();
  }
}
