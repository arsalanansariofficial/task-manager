import { beforeEach, expect, test } from 'bun:test';
import request from 'supertest';

import { gwensTasks, setupDb, newTask, ben } from '@/tests/fixtures/db';
import { Task } from '@/modules/task/model';
import { app } from '@/index';

beforeEach(setupDb);

test('should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${ben.tokens[0].token}`)
    .send(newTask)
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task?.completed).toBe(false);
});

test('user two should not delete task created by user one', async () => {
  await request(app)
    .delete(`/tasks/${gwensTasks._id}`)
    .set('Authorization', `Bearer ${ben.tokens[0].token}`)
    .send()
    .expect(400);

  const task = await Task.findById(gwensTasks._id);
  expect(task).not.toBeNull();
});

test('should fetch tasks for user', async () => {
  await Task.create(newTask);
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${ben.tokens[0].token}`)
    .expect(200);

  expect(response.body.length).toBe(2);
});
