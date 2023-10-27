/* eslint-disable linebreak-style */
const winston = require('winston');
const expressWinston = require('express-winston');

const loggerReq = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

const loggerErr = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  loggerReq,
  loggerErr,
};
