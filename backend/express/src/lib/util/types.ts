import z from 'zod';

export enum Headers {
  Authorization = 'Authorization',
  Bearer = 'Bearer'
}

export type RequireFields<T, K extends keyof T> = Required<Pick<T, K>> & T;
export type ModelType<T> = { [k in keyof T]: z.infer<T[k]> };
export type Err = { path: Array<string>; message: string };
