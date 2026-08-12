import { type Response, type Request, Router } from 'express';

import { userModel, User } from '@/modules/user/model';
import { userService } from '@/modules/user/service';

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
