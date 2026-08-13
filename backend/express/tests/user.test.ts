import { beforeEach, expect, test } from 'bun:test';
import request from 'supertest';

import {
  type UserWithToken,
  type LoggedInUser,
  type Response,
  setupDb,
  unknown,
  kevin,
  gwen,
  ben
} from '~/tests/fixtures/db';
import { User } from '@/modules/user/model';
import { app } from '@/index';

beforeEach(setupDb);

test('should signup a new user', async () => {
  const { body }: Response = await request(app).post('/users').send(unknown);

  const user = (await User.findById(body.user._id)) as UserWithToken;
  const [{ token }] = user.tokens;

  expect(user.password).not.toBe(unknown.password);
  expect(body).not.toBe({ token, user });
});

test('should delete account for authenticated user', async () => {
  const response = await request(app)
    .delete('/users/delete-profile')
    .set('Authorization', `Bearer ${ben.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(response.body._id);
  expect(user).toBeNull();
});

test('should upload profile picture for a user', async () => {
  await request(app)
    .post('/users/upload-profile-picture')
    .set('Authorization', `Bearer ${ben.tokens[0].token}`)
    .attach('uploadProfile', 'tests/fixtures/images/image.png')
    .expect(200);

  const user = await User.findById(ben._id);
  expect(user?.profilePicture).toBeDefined();
});

test('should update valid user fields', async () => {
  await request(app)
    .patch('/users/update-profile')
    .set('Authorization', `Bearer ${ben.tokens[0].token}`)
    .send({ name: gwen.name })
    .expect(201);

  const user = await User.findById(ben._id);
  expect(user?.name).toBe(gwen.name);
});

test('should not update invalid user fields', async () => {
  const response = await request(app)
    .patch('/users/update-profile')
    .set('Authorization', `Bearer ${ben.tokens[0].token}`)
    .send({ location: 'location' })
    .expect(201);

  expect(response.body?.location).toBeUndefined();
});

test('should login an existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({ password: gwen.password, email: gwen.email })
    .expect(200);

  const user = (await User.findById(response.body.user._id)) as LoggedInUser;
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('should get profile for a user', async () => {
  await request(app)
    .get('/users/view-profile')
    .set('Authorization', `Bearer ${kevin.tokens[0].token}`)
    .send()
    .expect(200);
});

test('should not login a non existing user', async () => {
  await request(app).post('/users/login').send(unknown).expect(400);
});

test('should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/view-profile').send().expect(401);
});

test('should not delete account for unauthenticated user', async () => {
  await request(app).delete('/users/delete-profile').send().expect(401);
});
