import { type UserDocument, User } from '@/modules/user/model';

async function login({ password, email }: User['userPayload']) {
  const user = await User.validateCredentials({ password, email });
  const token = await user.addToken();
  return { token, user };
}

async function logout({ token, user }: { user: UserDocument; token: string }) {
  return await user.updateOne({
    tokens: user.tokens.filter(t => t.token !== token),
    _id: user._id
  });
}

async function create(payload: User['userPayload']) {
  const user = new User(payload);
  const token = await user.addToken();
  return { token, user };
}

async function logoutAll(user: UserDocument) {
  return await user.updateOne({ _id: user._id, tokens: [] });
}

export const userService = { logoutAll, create, logout, login };
