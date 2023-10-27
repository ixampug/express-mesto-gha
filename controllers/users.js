/* eslint-disable no-underscore-dangle */
/* eslint-disable eol-last */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Errors = require('../errors/errors');

const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      next(Errors.default('Ошибка сервера'));
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(Errors.notFound('пользователь не сущетсвует'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(Errors.badRequest('Неверный запрос'));
      }
      return next(Errors.default('Ошибка сервера'));
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return next(Errors.default('Ошибка сервера'));
    }

    return User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    })
      .then((user) => {
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).send(userResponse);
      })
      // eslint-disable-next-line no-shadow
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(Errors.badRequest('Ошибка валидации'));
        }
        if (err.code === 11000) {
          return next(Errors.alreadyExists('такой email уже используется'));
        }
        return next(Errors.default('Ошибка сервера'));
      });
  });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(Errors.notFound('пользователя не существует'));
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(Errors.badRequest('Ошибка валидации'));
      }
      return next(Errors.default('Ошибка сервера'));
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(Errors.notFound('пользователя не существует'));
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(Errors.badRequest('Ошибка валидации'));
      }
      return next(Errors.default('Ошибка сервера'));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(Errors.notFound('пользователя не существует'));
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      return res.status(200).send({ token });
    })
    .catch(() => next(Errors.unauthorized('Ошибка авторизации')));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(Errors.notFound('пользователя не существует'));
      }
      return res.status(200).send(user);
    })
    .catch(() => next(Errors.default('Ошибка сервера')));
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateAvatar,
  updateProfile,
  login,
  getCurrentUser,
};
