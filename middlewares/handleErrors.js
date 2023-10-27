const ErrorAPI = require('../errors/errors');

const handleErrors = (err, req, res) => {
  if (err instanceof ErrorAPI) {
    return res.status(err.status).send({ message: err.message });
  }
  return res.status(ErrorAPI.default).send({ message: 'Ошибка сервера' });
};

module.exports = handleErrors;
