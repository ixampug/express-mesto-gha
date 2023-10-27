const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const DEFAULT = 500;
const ALREADY_EXIST = 409;
const FORBIDDEN = 403;
const UNAUTHORIZED = 401;
const REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/im;

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  ALREADY_EXIST,
  FORBIDDEN,
  UNAUTHORIZED,
  REGEX,
};
