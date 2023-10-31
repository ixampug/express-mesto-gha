const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('нужно авторизировться');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedError('неправильный токен');
  }

  req.user = payload;

  return next();
};

module.exports = auth;
