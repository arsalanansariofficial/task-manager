import { beforeEach, expect, test } from 'bun:test';
import request from 'supertest';

import { testUserOneId, testUserOne, setupDb } from '~/tests/fixtures/db';
import { User } from '@/modules/user/model';
import { app } from '@/index';

beforeEach(setupDb);

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      email: 'test.user.four@example.com',
      password: '#TestUserFour123',
      name: 'user four',
      age: 25
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: { email: 'test.user.four@example.com', name: 'user four' },
    token: user?.tokens[0]?.token
  });

  expect(user?.password).not.toBe('#TestUserFour123');
});

test('Should delete account for authenticated user', async () => {
  const response = await request(app)
    .delete('/users/delete-profile')
    .set('Authorization', `Bearer ${testUserOne?.tokens[0]?.token}`)
    .send()
    .expect(200);
  const user = await User.findById(response.body._id);
  expect(user).toBeNull();
});

test('Should upload profile picture for a user', async () => {
  await request(app)
    .post('/users/upload-profile-picture')
    .set('Authorization', `Bearer ${testUserOne?.tokens[0]?.token}`)
    .attach('uploadProfile', 'tests/fixtures/images/image.png')
    .expect(200);

  const user = await User.findById(testUserOneId);
  expect(Boolean(user?.profilePicture)).toEqual(true);
});

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/update-profile')
    .set('Authorization', `Bearer ${testUserOne?.tokens[0]?.token}`)
    .send({ name: 'test user updated' })
    .expect(201);

  const user = await User.findById(testUserOneId);
  expect(user?.name).toBe('test user updated');
});

test('Should not update invalid user fields', async () => {
  const response = await request(app)
    .patch('/users/update-profile')
    .set('Authorization', `Bearer ${testUserOne?.tokens[0]?.token}`)
    .send({ location: 'location' })
    .expect(201);

  expect(response.body?.location).toBeUndefined();
});

test('Should login an existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({ password: testUserOne.password, email: testUserOne.email })
    .expect(200);

  const user = await User.findById(response.body.user._id);
  expect(response.body.token).toBe(user?.tokens[1]?.token);
});

test('Should get profile for a user', async () => {
  await request(app)
    .get('/users/view-profile')
    .set('Authorization', `Bearer ${testUserOne?.tokens[0]?.token}`)
    .send()
    .expect(200);
});

test('Should not login a non existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({ password: '#NonExistingUser123', email: 'test@example.com' })
    .expect(400);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/view-profile').send().expect(401);
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app).delete('/users/delete-profile').send().expect(401);
});
