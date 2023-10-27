const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  ALREADY_EXIST,
  FORBIDDEN,
  UNAUTHORIZED,
} = require('../utils/constants');

class ErrorAPI extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static badRequest(msg) {
    return new ErrorAPI(BAD_REQUEST, msg);
  }

  static notFound(msg) {
    return new ErrorAPI(NOT_FOUND, msg);
  }

  static default(msg) {
    return new ErrorAPI(DEFAULT, msg);
  }

  static alreadyExist(msg) {
    return new ErrorAPI(ALREADY_EXIST, msg);
  }

  static forbidden(msg) {
    return new ErrorAPI(FORBIDDEN, msg);
  }

  static unauthorized(msg) {
    return new ErrorAPI(UNAUTHORIZED, msg);
  }
}

module.exports = ErrorAPI;
