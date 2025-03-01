const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user');

const authentication = async (request, response, next) => {
  const unauthenticatedUser = {
    code: 401,
    message: 'User not authenticated'
  };
  const sessionExpired = {
    code: 401,
    message: 'Session expired'
  };
  try {
    const token = request.header('Authorization').replace('Bearer ', '');
    const privateKey = process.env.secretKey;
    const _id = jwt.verify(token, privateKey)._id;

    const user = await UserModel.findOne({ _id: _id, 'tokens.token': token });
    if (!user) return response.status(401).send(unauthenticatedUser);

    request.user = user;
    request.token = token;
    next();
  } catch (error) {
    response.status(401).send(sessionExpired);
  }
};

module.exports = { authentication };
