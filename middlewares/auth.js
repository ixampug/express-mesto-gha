const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, 'some-secret-key');
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
};

module.exports = authMiddleware;
