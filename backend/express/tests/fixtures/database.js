const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { UserModel } = require('../../src/modules/models/user');
const { TaskModel } = require('../../src/modules/models/task');

const testUserId = new mongoose.Types.ObjectId();

const testUser = {
  tokens: [
    {
      token: jwt.sign({ _id: testUserId.toString() }, process.env.secretKey, {
        expiresIn: '1 hour'
      })
    }
  ],
  email: 'test-user-one@example.com',
  password: 'test-user',
  name: 'User One',
  _id: testUserId
};

const testUserTwoId = new mongoose.Types.ObjectId();

const testUserTwo = {
  tokens: [
    {
      token: jwt.sign(
        { _id: testUserTwoId.toString() },
        process.env.secretKey,
        { expiresIn: '1 hour' }
      )
    }
  ],
  email: 'test-user-two@example.com',
  password: 'test-user-two',
  _id: testUserTwoId,
  name: 'User Two'
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Task One',
  owner: testUserId,
  completed: false
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Task Two',
  owner: testUserId,
  completed: true
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Task Three',
  owner: testUserTwoId,
  completed: true
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
  testUserTwoId,
  setupDatabase,
  testUserTwo,
  testUserId,
  taskThree,
  testUser,
  taskOne,
  taskTwo
};
