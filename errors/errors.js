const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  ALREADY_EXIST,
  FORBIDDEN,
  UNAUTHORIZED,
} = require('../utils/constants');

class Errors extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static badRequest(msg) {
    return new Errors(BAD_REQUEST, msg);
  }

  static notFound(msg) {
    return new Errors(NOT_FOUND, msg);
  }

  static default(msg) {
    return new Errors(DEFAULT, msg);
  }

  static alreadyExist(msg) {
    return new Errors(ALREADY_EXIST, msg);
  }

  static forbidden(msg) {
    return new Errors(FORBIDDEN, msg);
  }

  static unauthorized(msg) {
    return new Errors(UNAUTHORIZED, msg);
  }
}

module.exports = Errors;
