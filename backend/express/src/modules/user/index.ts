import { type Response, type Request, Router } from 'express';

import { userModel, User } from '@/modules/user/model';
import { userService } from '@/modules/user/service';
import { upload } from '@/lib/middlewares/upload';
import { auth } from '@/lib/middlewares/auth';

export const userRoutes = Router();

userRoutes.post(
  '/users/upload-profile-picture',
  auth,
  upload.single('uploadProfile'),
  async (
    request: Request,
    response: Response<User['userResponse']['user']>
  ) => {
    const user = await userService.uploadProfilePicture({
      file: request.file,
      user: request.user
    });

    return response
      .status(200)
      .json(userModel.userResponse.shape.user.parse(user));
  }
);

userRoutes.post(
  '/users/logoutAll',
  auth,
  async (request: Request, response: Response<User['success']>) => {
    await userService.logoutAll(request.user);
    response
      .status(200)
      .json(
        userModel.success.parse({
          message: 'All sessions have been revoked.',
          success: true
        })
      );
  }
);

userRoutes.delete(
  '/users/delete-profile-picture',
  auth,
  async (
    request: Request,
    response: Response<User['userResponse']['user']>
  ) => {
    await userService.deleteProfilePicture(request.user);
    response
      .status(200)
      .json(userModel.userResponse.shape.user.parse(request.user));
  }
);

userRoutes.patch(
  '/users/update-profile',
  auth,
  async (
    request: Request<object, object, User['userPayload']>,
    response: Response<User['userResponse']['user']>
  ) => {
    const user = await userService.updateUser({
      payload: userModel.userPayload.parse(request.body),
      user: request.user
    });
    response.status(201).json(userModel.userResponse.shape.user.parse(user));
  }
);

userRoutes.post(
  '/users',
  async (
    request: Request<object, object, User['userPayload']>,
    response: Response<User['userResponse']>
  ) => {
    const { token, user } = await userService.create(
      userModel.userPayload.parse(request.body)
    );
    response.status(201).send(userModel.userResponse.parse({ token, user }));
  }
);

userRoutes.post(
  '/users/login',
  async (
    request: Request<object, object, User['userPayload']>,
    response: Response<User['userResponse']>
  ) => {
    const { token, user } = await userService.login(
      userModel.userPayload.parse(request.body)
    );
    response.status(200).send(userModel.userResponse.parse({ token, user }));
  }
);

userRoutes.get(
  '/users/:id/view-profile-picture',
  async (
    request: Request<{ id: string }>,
    response: Response<Buffer<ArrayBuffer>>
  ) => {
    const buffer = await userService.getUserProfile(request.params.id);
    response.set('content-type', 'image/png;image/jpg;image/jpeg');
    response.status(200).send(buffer);
  }
);

userRoutes.delete(
  '/users/delete-profile',
  auth,
  async (
    request: Request,
    response: Response<User['userResponse']['user']>
  ) => {
    await userService.deleteUser(request.user);
    response.json(userModel.userResponse.shape.user.parse(request.user));
  }
);

userRoutes.get(
  '/users/view-profile',
  auth,
  async (request: Request, response: Response<User['userPayload']>) => {
    response.status(200).json(userModel.userPayload.parse(request.user));
  }
);

userRoutes.get(
  '/users/:id',
  async (
    request: Request<{ id: string }>,
    response: Response<User['userResponse']['user']>
  ) => {
    const user = await userService.getUserById(request.params.id);
    response.status(200).json(userModel.userResponse.shape.user.parse(user));
  }
);

userRoutes.post(
  '/users/logout',
  auth,
  async (request: Request, response: Response<User['success']>) => {
    await userService.logout({ token: request.token, user: request.user });
    response
      .status(200)
      .send({ message: 'User has been logged out.', success: true });
  }
);
