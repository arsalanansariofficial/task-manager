import { type Response, type Request, Router } from 'express';

import { userModel, User } from '@/modules/user/model';
import { userService } from '@/modules/user/service';
import { auth } from '@/lib/middlewares/auth';

export const userRoutes = Router();

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

userRoutes.get(
  '/users/view-profile',
  auth,
  async (
    request: Request<object, object, User['userPayload']>,
    response: Response<User['user']>
  ) => {
    response.status(200).json(userModel.user.parse(request.user));
  }
);
