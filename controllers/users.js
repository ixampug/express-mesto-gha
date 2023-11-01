/* eslint-disable no-underscore-dangle */
/* eslint-disable eol-last */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  NotFoundError, BadRequestError, DefaultError, AlreadyExistError, UnauthorizedError,
} = require('../errors/errors');

const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return User
    .findById(userId)
    .then((r) => {
      if (r === null) {
        return next(new NotFoundError('user not found'));
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return next(new BadRequestError('invalid ID'));
      }
      return next(new DefaultError('server error'));
    });
};

const createUser = (req, res, next) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
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
      .catch((error) => {
        if (error.name === 'ValidationError') {
          return next(new BadRequestError('Ошибка валидации'));
        } if (error.code === 11000) {
          return next(new AlreadyExistError('такой email уже используется'));
        }
        return next(new DefaultError('Ошибка сервера'));
      }))
    .catch(() => next(new DefaultError('Ошибка сервера')));
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
        return next(new NotFoundError('User not found'));
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Validation Error'));
      }
      return next(new DefaultError('Internal Server Error'));
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
        return next(new NotFoundError('User not found'));
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Validation Error'));
      }
      return next(new DefaultError('Internal Server Error'));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('пользователя не существует'));
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      return res.status(200).send({ token });
    })
    .catch(() => next(new UnauthorizedError('Ошибка авторизации')));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('пользователя не существует'));
      }
      return res.status(200).send(user);
    })
    .catch(() => next(new DefaultError('Ошибка сервера')));
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