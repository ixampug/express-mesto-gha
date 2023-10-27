const Errors = require('../errors/errors');
const logger = require('../utils/logger');

const handleErrors = (err, req, res) => {
  if (err instanceof Errors) {
    logger.error(`Error occurred: ${err.message}`);
    return res.status(err.status).send({ message: err.message });
  }
  logger.error(`Internal Server Error: ${err}`);
  return res.status(Errors.default).send({ message: 'Ошибка сервера' });
};

module.exports = handleErrors;
