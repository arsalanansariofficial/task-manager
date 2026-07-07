const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../../src/models/user');
const { TaskModel } = require('../../src/models/task');

const testUserId = new mongoose.Types.ObjectId();

const testUser = {
  _id: testUserId,
  name: 'User One',
  email: 'test-user-one@example.com',
  password: 'test-user',
  tokens: [
    {
      token: jwt.sign({ _id: testUserId.toString() }, process.env.secretKey, {
        expiresIn: '1 hour'
      })
    }
  ]
};

const testUserTwoId = new mongoose.Types.ObjectId();

const testUserTwo = {
  _id: testUserTwoId,
  name: 'User Two',
  email: 'test-user-two@example.com',
  password: 'test-user-two',
  tokens: [
    {
      token: jwt.sign(
        { _id: testUserTwoId.toString() },
        process.env.secretKey,
        { expiresIn: '1 hour' }
      )
    }
  ]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Task One',
  completed: false,
  owner: testUserId
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Task Two',
  completed: true,
  owner: testUserId
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Task Three',
  completed: true,
  owner: testUserTwoId
};

const setupDatabase = async () => {
  await UserModel.deleteMany();
  await TaskModel.deleteMany();
  await new UserModel(testUser).save();
  await new UserModel(testUserTwo).save();
  await new TaskModel(taskOne).save();
  await new TaskModel(taskTwo).save();
  await new TaskModel(taskThree).save();
};

module.exports = {
  testUserId,
  testUser,
  testUserTwoId,
  testUserTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
};
