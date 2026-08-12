import { beforeEach, expect, test } from 'bun:test';
import request from 'supertest';

import {
  testUserOne,
  testUserTwo,
  setupDb,
  taskOne
} from '~/tests/fixtures/db';
import { Task } from '@/modules/task/model';
import { app } from '@/index';

beforeEach(setupDb);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${testUserOne?.tokens[0]?.token}`)
    .send({ description: 'Test Task' })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task?.completed).toBe(false);
});

test('User two should not delete task created by user one', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${testUserTwo?.tokens[0]?.token}`)
    .send()
    .expect(400);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test('Should fetch tasks for user', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${testUserOne?.tokens[0]?.token}`)
    .expect(200);
  expect(response.body.length).toBe(2);
});
