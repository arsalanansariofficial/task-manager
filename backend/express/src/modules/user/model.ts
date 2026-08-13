import {
  type HydratedDocument,
  Schema,
  Model,
  Types,
  model,
  Query
} from 'mongoose';
import bcrypt from 'bcryptjs';
import z from 'zod';

import type { OptionalFields, ModelType } from '@/lib/util/types';

import { generateToken, verifyToken } from '@/lib/token';
import { InvalidCredentialsError } from '@/lib/error';
import { hashPassword, _id } from '@/lib/util';
import { Task } from '@/modules/task/model';
import { removeFile } from '@/lib/file';
import { env } from '@/lib/config';

export type UserStatics = {
  validateCredentials(payload: {
    password?: string;
    email?: string;
    token?: string;
  }): Promise<UserDocument>;
};
export type UserMethods = {
  toJSON(): Omit<User['user'], 'password' | 'tokens'>;
  addToken(): Promise<string>;
};
export type UserModel = Model<User['user'], object, UserMethods> & UserStatics;
export type TokenDocument = HydratedDocument<User['user']['tokens'][0]>;
export type UserDocument = HydratedDocument<User['user'], UserMethods>;
export type UserWithToken = { user: UserDocument; token: string };
export type User = ModelType<typeof userModel>;

const token = z.object({ token: z.string(), _id });

export const user = z.object({
  password: z
    .string('Password should be valid.')
    .nonempty('Password is required.')
    .min(8, 'Password must be at least 8 characters long.')
    .max(256, 'Password must be at most 256 characters long.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character.'
    )
    .trim(),
  age: z.coerce
    .number({ error: 'Age should be valid.' })
    .positive({ error: 'Age should be positive.' }),
  name: z
    .string('Name should be valid.')
    .nonempty('Name is required.')
    .trim()
    .toLowerCase(),
  email: z.email('Email should be valid.').trim().toLowerCase(),
  profilePicture: z.string().optional(),
  tokens: z.array(token),
  _id
});

const success = z.object({
  message: z.string({ error: 'Message should be valid.' }),
  success: z.boolean().default(true)
});

export const userModel = {
  userResponse: z.object({
    user: user.omit({ password: true, tokens: true }).partial(),
    token: z.string()
  }),
  userPayload: user.partial(),
  success,
  token,
  user
};

export const User = model<User['user'], UserModel>(
  'User',
  new Schema<User['user'], UserModel, UserMethods>(
    {
      email: {
        validate(value: string) {
          return userModel.user.shape.email.parse(value);
        },
        lowercase: true,
        required: true,
        type: String,
        unique: true,
        trim: true
      },
      password: {
        validate(value: string) {
          return userModel.user.shape.password.parse(value);
        },
        required: true,

        type: String,
        minLength: 8,
        trim: true
      },
      age: {
        validate(value: number) {
          return userModel.userPayload.shape.age.parse(value);
        },
        type: Number
      },
      name: { lowercase: true, required: true, type: String, trim: true },
      tokens: [{ token: { type: String } }],
      profilePicture: { type: String }
    },
    {
      statics: {
        async validateCredentials({ password, email, token }) {
          const { _id } = (token && verifyToken(token)) || { _id: undefined };
          const error = new InvalidCredentialsError();
          const [errors] = error.errors;

          const user = await this.findOne({
            $or: [{ 'tokens.token': token, _id }, { email }]
          });

          if (!user) {
            errors.path = [token, email, _id].filter((v): v is string =>
              Boolean(v)
            );
            throw error;
          }

          if (password && !(await bcrypt.compare(password, user.password))) {
            errors.path = [password, email].filter((v): v is string =>
              Boolean(v)
            );
            throw error;
          }

          return user;
        }
      },
      methods: {
        toJSON() {
          const userObject = this.toObject() as OptionalFields<
            User['user'],
            'password' | 'tokens'
          >;
          delete userObject.password;
          delete userObject.tokens;
          return userObject;
        },
        async addToken() {
          const token = generateToken(this.id);
          await saveToken({ user: this, token });
          removeExpiredToken({ user: this, token });
          return token;
        }
      },
      virtuals: {
        tasks: {
          options: { foreignField: 'owner', localField: '_id', ref: 'Task' }
        }
      },
      timestamps: true
    }
  )
    .pre('deleteOne', { document: true, query: false }, deleteTasksAfterUser)
    .pre('deleteMany', deleteTasksAfterUsers)
    .pre('save', hashPasswordBeforeSave)
);

export function removeExpiredToken({ token, user }: UserWithToken) {
  setTimeout(async () => {
    user.tokens = user.tokens.filter(t => t.token !== token);
    await user.save();
  }, env.JWT_EXPIRES_IN);
}

export async function saveToken({ token, user }: UserWithToken) {
  user.tokens = user.tokens.concat({ _id: new Types.ObjectId(), token });
  await user.save();
}

export async function deleteTasksAfterUser(this: UserDocument) {
  await cleanUserProfile({
    profilePicture: this.profilePicture,
    owner: this._id
  });
}

export async function hashPasswordBeforeSave(this: UserDocument) {
  if (this.isModified('password'))
    this.password = await hashPassword(this.password);
}

async function deleteTasksAfterUsers(
  this: Query<object, object, object, unknown, 'find', UserDocument>
) {
  const filter = this.getFilter();
  const users = await this.model.find(filter);

  await Promise.all(
    users.map(
      async u =>
        await cleanUserProfile({
          profilePicture: u.profilePicture,
          owner: u._id
        })
    )
  );
}

async function cleanUserProfile({
  profilePicture,
  owner
}: {
  profilePicture?: undefined | string;
  owner: Types.ObjectId | string;
}) {
  await Task.deleteMany({ owner });
  await removeFile(profilePicture);
}
