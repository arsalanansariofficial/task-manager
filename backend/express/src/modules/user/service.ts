import { type UserDocument, userModel, User } from '@/modules/user/model';
import { bufferFromFile, removeFile } from '@/lib/file';
import { UserNotFoundError } from '@/lib/error';

async function getUserProfile(id: string) {
  const user = await User.findById(id);

  if (!user)
    throw new UserNotFoundError([
      { message: `User with id ${id} does not exist.`, path: [id] }
    ]);

  if (!user.profilePicture)
    throw new UserNotFoundError([
      { message: `User doesn't have a profile picture.`, path: [id] }
    ]);

  return await bufferFromFile(user.profilePicture);
}

async function getUserById(id: string) {
  const user = await User.findById(id);

  if (!user)
    throw new UserNotFoundError([
      { message: `User with id ${id} does not exist.`, path: [id] }
    ]);

  return user;
}

async function uploadProfilePicture({
  file,
  user
}: {
  file: { filename: string } | undefined;
  user: UserDocument;
}) {
  if (!file) return user;
  user.profilePicture = file.filename;
  return await user.save();
}

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

async function updateUser({
  payload,
  user
}: {
  payload: User['userPayload'];
  user: UserDocument;
}) {
  user.set(userModel.userPayload.parse(payload));
  return await user.save();
}

async function deleteProfilePicture(user: UserDocument) {
  await removeFile(user.profilePicture);
  user.profilePicture = undefined;
  await user.save();
}

async function create(payload: User['userPayload']) {
  const user = new User(payload);
  const token = await user.addToken();
  return { token, user };
}

async function logoutAll(user: UserDocument) {
  return await user.updateOne({ _id: user._id, tokens: [] });
}

async function deleteUser(user: UserDocument) {
  await user.deleteOne();
}

export const userService = {
  uploadProfilePicture,
  deleteProfilePicture,
  getUserProfile,
  getUserById,
  updateUser,
  deleteUser,
  logoutAll,
  create,
  logout,
  login
};
