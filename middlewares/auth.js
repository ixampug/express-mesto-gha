const jwt = require('jsonwebtoken');
const ErrorAPI = require('../errors/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(ErrorAPI.unauthorized('нужно авторизировться'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(ErrorAPI.unauthorized('неправильный токен'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
