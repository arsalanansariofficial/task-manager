import { Types } from 'mongoose';

import { User } from '@/modules/user/model';
import { Task } from '@/modules/task/model';
import { generateToken } from '@/lib/token';

export type UserWithToken = Omit<
  User['user'],
  'age'
> & { tokens: [User['token']] };

export type Response = { body: { user: User['user']; token: string } };
export type LoggedInUser = { tokens: [User['token'], User['token']] };

export const ben: UserWithToken = {
  tokens: [{ _id: new Types.ObjectId(), token: String() }],
  password: 'Ben.Tennyson@123',
  _id: new Types.ObjectId(),
  name: 'ben tennyson',
  email: 'ben@cn.com'
};

export const gwen: UserWithToken = {
  tokens: [{ _id: new Types.ObjectId(), token: String() }],
  password: 'Gwen.Tennyson@123',
  _id: new Types.ObjectId(),
  name: 'gwen tennyson',
  email: 'gwen@cn.com'
};

export const kevin: UserWithToken = {
  tokens: [{ _id: new Types.ObjectId(), token: String() }],
  password: 'Kevin.Eleven@123',
  name: 'kevin ethan leven',
  _id: new Types.ObjectId(),
  email: 'kevin@cn.com'
};

export const unknown = {
  password: 'Unknown.Password@123',
  _id: new Types.ObjectId(),
  email: 'unknown@cn.com',
  name: 'unknown user'
};

export const bensTasks = {
  description: 'learn about swampfire',
  _id: new Types.ObjectId(),
  owner: ben._id
};

export const newTask = {
  description: 'learn about heatblast',
  _id: new Types.ObjectId(),
  owner: ben._id
};

export const gwensTasks = {
  description: 'meet charm caster',
  _id: new Types.ObjectId(),
  owner: gwen._id
};

export const kevinsTasks = {
  description: 'stop aggregor',
  _id: new Types.ObjectId(),
  owner: kevin._id,
  completed: true
};

export async function setupDb() {
  await User.deleteMany();
  await Task.deleteMany();

  ben.tokens[0].token = generateToken(ben._id.toString());
  gwen.tokens[0].token = generateToken(gwen._id.toString());
  kevin.tokens[0].token = generateToken(kevin._id.toString());

  await new User(ben).save();
  await new User(gwen).save();
  await new User(kevin).save();

  await new Task(bensTasks).save();
  await new Task(gwensTasks).save();
  await new Task(kevinsTasks).save();
}
