/* eslint-disable no-underscore-dangle */
/* eslint-disable eol-last */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorAPI = require('../errors/errors').default;

const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      next(ErrorAPI.default('Ошибка сервера'));
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(ErrorAPI.notFound('пользователь не сущетсвует'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(ErrorAPI.badRequest('Неверный запрос'));
      }
      return next(ErrorAPI.default('Ошибка сервера'));
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
      return next(ErrorAPI.default('Ошибка сервера'));
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
          return next(ErrorAPI.badRequest('Ошибка валидации'));
        }
        if (err.code === 11000) {
          return next(ErrorAPI.alreadyExists('такой email уже используется'));
        }
        return next(ErrorAPI.default('Ошибка сервера'));
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
        return next(ErrorAPI.notFound('пользователя не существует'));
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(ErrorAPI.badRequest('Ошибка валидации'));
      }
      return next(ErrorAPI.default('Ошибка сервера'));
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
        return next(ErrorAPI.notFound('пользователя не существует'));
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(ErrorAPI.badRequest('Ошибка валидации'));
      }
      return next(ErrorAPI.default('Ошибка сервера'));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(ErrorAPI.notFound('пользователя не существует'));
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      return res.status(200).send({ token });
    })
    .catch(() => next(ErrorAPI.unauthorized('Ошибка авторизации')));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(ErrorAPI.notFound('пользователя не существует'));
      }
      return res.status(200).send(user);
    })
    .catch(() => next(ErrorAPI.default('Ошибка сервера')));
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
