import mongoose, { Types } from 'mongoose';

import { User } from '@/modules/user/model';
import { Task } from '@/modules/task/model';
import { generateToken } from '@/lib/token';

export const testUserOneId = new Types.ObjectId();
export const testUserTwoId = new Types.ObjectId();

export const testUserOne = {
  tokens: [{ token: generateToken(testUserOneId.toString()) }],
  email: 'test.user.one@example.com',
  password: '#TestUserOne123',
  _id: testUserOneId,
  name: 'user one',
  age: 25
};

export const testUserTwo = {
  tokens: [{ token: generateToken(testUserTwoId.toString()) }],
  email: 'test.user.two@example.com',
  password: '#TestUserTwo123',
  _id: testUserTwoId,
  name: 'User Two',
  age: 25
};

export const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Task One',
  owner: testUserOneId,
  completed: false
};

export const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Task Two',
  owner: testUserOneId,
  completed: true
};

export const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Task Three',
  owner: testUserTwoId,
  completed: true
};

export async function setupDb() {
  await User.deleteMany();
  await Task.deleteMany();

  await new User(testUserOne).save();
  await new User(testUserTwo).save();

  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
}
