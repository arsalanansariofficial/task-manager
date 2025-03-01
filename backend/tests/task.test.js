const { app } = require('../src/app');
const request = require('supertest');
const mongoose = require('mongoose');
const { TaskModel } = require('../src/models/task');
const {
  setupDatabase,
  testUser,
  testUserId,
  taskOne,
  testUserTwo
} = require('./fixtures/database');

beforeEach(setupDatabase);

afterAll(async () => {
  await mongoose.connection.close();
});

test('Should create task for user', async () => {
  const response = await request(app)
    ['post']('/tasks')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({
      description: 'Test Task'
    })
    .expect(201);
  const task = await TaskModel.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task['completed']).toBe(false);
});

test('Should fetch tasks for user', async () => {
  const response = await request(app)
    ['get']('/tasks')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .expect(200);
  expect(response.body.length).toBe(2);
});

test('User two should not delete task created by user one', async () => {
  await request(app)
    ['delete'](`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${testUserTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await TaskModel.findById(taskOne._id);
  expect(task).not.toBeNull();
});
