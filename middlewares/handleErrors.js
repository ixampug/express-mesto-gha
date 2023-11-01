const handleErrors = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'ошибка сервера' : err.message;
  res.status(statusCode).send({ message });
  next();
};

module.exports = handleErrors;
