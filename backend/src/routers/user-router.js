const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
// const sharp = require("sharp");

const { UserModel } = require('../models/user');
const { uploadProfile } = require('../middleware/image-upload');
const { authentication } = require('../middleware/authentication');
// const {sendWelcomeEmail, sendCancellationEmail} = require("../emails/email");

const userRouter = new express.Router();

userRouter.post('/users', async (request, response) => {
  const user = new UserModel(request.body);
  user.profilePicture = 'default-profile-picture.png';
  try {
    const token = await user['generateAuthenticationToken']();
    // sendWelcomeEmail(user['email'], user['name']);
    response.status(201).send({ user, token });
  } catch (error) {
    response.status(500).send(error);
  }
});

userRouter.post('/users/login', async (request, response) => {
  try {
    const user = await UserModel['findByCredentials'](
      request.body.email,
      request.body.password
    );
    const token = await user['generateAuthenticationToken']();
    response.status(200).send({ user, token });
  } catch (error) {
    if (error.message === 'Failed to login') {
      const errorResponse = {
        code: 400,
        message: error.message
      };
      response.status(400).send(errorResponse);
    } else response.status(500).send(error);
  }
});

userRouter.post('/users/logout', authentication, async (request, response) => {
  try {
    request.user.tokens = request.user.tokens.filter(({ token }) => {
      return token !== request.token;
    });
    await request.user.save();
    response.status(200).send('Session deactivated');
  } catch (error) {
    response.status(500).send(error);
  }
});

userRouter.post(
  '/users/logoutAll',
  authentication,
  async (request, response) => {
    try {
      request.user.tokens = [];
      await request.user.save();
      response.status(200).send('Sessions deactivated');
    } catch (error) {
      response.status(500).send(error);
    }
  }
);

userRouter.get(
  '/users/view-profile',
  authentication,
  async (request, response) => {
    response.status(200).send(request.user);
  }
);

userRouter.patch(
  '/users/update-profile',
  authentication,
  async (request, response) => {
    const keys = Object.keys(request.body);
    const allowedKeys = ['name', 'email', 'password', 'age'];
    const isValidUser = keys.every(key => allowedKeys.includes(key));

    if (!isValidUser) {
      const errorResponse = {
        code: 400,
        message: 'Invalid updates'
      };
      return response.status(400).send(errorResponse);
    }

    try {
      keys.forEach(key => (request.user[key] = request.body[key]));
      await request.user.save();
      response.status(201).send(request.user);
    } catch (error) {
      response.status(500).send(error);
    }
  }
);

userRouter.delete(
  '/users/delete-profile',
  authentication,
  async (request, response) => {
    try {
      await request.user.remove();
      // sendCancellationEmail(request.user.email);
      response.send(request.user);
    } catch (error) {
      response.status(500).send(error);
    }
  }
);

userRouter.post(
  '/users/upload-profile-picture',
  authentication,
  uploadProfile.single('uploadProfile'),
  async (request, response) => {
    try {
      // Changes the image format to png and resize the image to 250 x 250
      // const buffer = await sharp(request.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
      // request.user.profilePicture = buffer;

      // Generate a random hash
      const hash = crypto
        .createHash('sha256')
        .update(request.file.originalname)
        .digest('hex');
      const extension = request.file.mimetype.split('/')[1];

      // Save the profile picture with the generated hash
      fs.writeFileSync(`public/img/${hash}.${extension}`, request.file.buffer);
      request.user.profilePicture = `/img/${hash}.${extension}`;

      await request.user.save();
      response.status(200).send(request.user);
    } catch (error) {
      const errorResponse = {
        code: 500,
        message: 'Internal server error'
      };
      response.status(500).send(errorResponse);
    }
  }
);

userRouter.delete(
  '/users/delete-profile-picture',
  authentication,
  async (request, response) => {
    try {
      request.user.profilePicture = undefined;
      await request.user.save();
      response.status(200).send(request.user);
    } catch (error) {
      response.status(500).send(error);
    }
  }
);

userRouter.get('/users/:id/view-profile-picture', async (request, response) => {
  try {
    const user = await UserModel.findById(request.params.id);
    if (!user || !user['profilePicture']) {
      const errorResponse = {
        code: 400,
        message: 'User not found'
      };
      return response.status(400).send(errorResponse);
    }
    response.set('Content-Type', 'image/png;image/jpg;image/jpeg');
    response.status(200).send(user['profilePicture']);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = userRouter;
