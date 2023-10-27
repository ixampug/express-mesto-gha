const ErrorAPI = require('../errors/errors').default;

const handleErrors = (err, req, res) => {
  if (err instanceof ErrorAPI) {
    res.status(err.status);
    res.set('Content-Type', 'application/json');
    res.send({ message: err.message });
  } else {
    res.status(ErrorAPI.default);
    res.set('Content-Type', 'application/json');
    res.send({ message: 'Ошибка сервера' });
  }
};

module.exports = handleErrors;
