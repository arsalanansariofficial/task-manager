const { app } = require('../src/app');
const request = require('supertest');
const mongoose = require('mongoose');
const { setupDatabase, testUser, testUserId } = require('./fixtures/database');
const { UserModel } = require('../src/models/user');

beforeEach(setupDatabase);

afterAll(async () => {
  await mongoose.connection.close();
});

test('Should signup a new user', async () => {
  const response = await request(app)
    ['post']('/users')
    .send({
      name: 'User Three',
      email: 'test-user-three@example.com',
      password: 'test-user-three'
    })
    .expect(201);

  const user = await UserModel.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: 'User Three',
      email: 'test-user-three@example.com'
    },
    token: user['tokens'][0].token
  });

  expect(user['password']).not.toBe('test-user-three');
});

test('Should login an existing user', async () => {
  const response = await request(app)
    ['post']('/users/login')
    .send({
      email: testUser.email,
      password: testUser.password
    })
    .expect(200);

  const user = await UserModel.findById(response.body.user._id);
  expect(response.body.token).toBe(user['tokens'][1].token);
});

test('Should not login a non existing user', async () => {
  await request(app)
    ['post']('/users/login')
    .send({
      email: 'test@example.com',
      password: '123'
    })
    .expect(400);
});

test('Should get profile for a user', async () => {
  await request(app)
    ['get']('/users/view-profile')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app)['get']('/users/view-profile').send().expect(401);
});

test('Should delete account for authenticated user', async () => {
  const response = await request(app)
    ['delete']('/users/delete-profile')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await UserModel.findById(response.body._id);
  expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app)['delete']('/users/delete-profile').send().expect(401);
});

test('Should upload profile picture for a user', async () => {
  await request(app)
    ['post']('/users/upload-profile-picture')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    ['attach']('uploadProfile', 'tests/fixtures/WALLS-25.jpeg')
    .expect(200);

  const user = await UserModel.findById(testUserId);
  expect(!!user['profilePicture']).toEqual(true);
});

test('Should update valid user fields', async () => {
  await request(app)
    ['patch']('/users/update-profile')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({
      name: 'Test User Updated'
    })
    .expect(201);

  const user = await UserModel.findById(testUserId);
  expect(user['name']).toBe('Test User Updated');
});

test('Should not update invalid user fields', async () => {
  await request(app)
    ['patch']('/users/update-profile')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({
      location: 'location'
    })
    .expect(400);
});
