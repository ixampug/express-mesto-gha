/* eslint-disable no-underscore-dangle */
/* eslint-disable eol-last */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const ErrorAPI = require('../errors/errors');
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  ALREADY_EXIST,
  UNAUTHORIZED,
} = require('../utils/constants');

const User = require('../models/user');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((e) => {
      if (e) {
        res.status(DEFAULT).send({ message: 'Internal Server Error' });
      } else {
        res.status(NOT_FOUND).send({ message: 'Users not found' });
      }
    });
};

const getUserById = (req, res) => {
  const { userID } = req.params;
  return User
    .findById(userID)
    .then((r) => {
      if (r === null) {
        return res.status(NOT_FOUND).send({ message: 'user not found' });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'invalid ID' });
      }
      return res.status(DEFAULT).send({ message: 'server error' });
    });
};
const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
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
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Ошибка валидации' });
        } else if (err.code === 11000) {
          res.status(ALREADY_EXIST).send({ message: 'такой email уже используется' });
        } else {
          res.status(500).send({ message: 'Ошибка сервера' });
        }
      }))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(NOT_FOUND).send({ message: 'User not found' });
      } else {
        res.status(200).send(updatedUser);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Validation Error' });
      } else {
        res.status(DEFAULT).send({ message: 'Internal Server Error' });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(NOT_FOUND).send({ message: 'User not found' });
      } else {
        res.status(200).send(updatedUser);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Validation Error' });
      } else {
        res.status(DEFAULT).send({ message: 'Internal Server Error' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'пользователя не существует' });
      } else {
        const token = jwt.sign(
          { _id: user._id },
          'some-secret-key',
          { expiresIn: '7d' },
        );
        res.status(200).send({ token });
      }
    })
    .catch(() => res.status(UNAUTHORIZED).send({ message: 'Ошибка авторизации' }));
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'пользователя не существует' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
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
