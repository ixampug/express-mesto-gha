/* eslint-disable max-classes-per-file */
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

class AlreadyExistError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
  DefaultError,
  AlreadyExistError,
  ForbiddenError,
  UnauthorizedError,
};
