import { User } from '@/modules/user/model';

async function login({ password, email }: User['userPayload']) {
  const user = await User.validateCredentials({ password, email });
  const token = await user.addToken();
  return { token, user };
}

async function create(payload: User['userPayload']) {
  const user = new User(payload);
  const token = await user.addToken();
  return { token, user };
}

export const userService = { create, login };
