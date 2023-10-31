/* eslint-disable no-underscore-dangle */
/* eslint-disable eol-last */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NotFoundError, BadRequestError, DefaultError } = require('../errors/errors');

const User = require('../models/user');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      const error = new DefaultError('ошибка сервера');
      res.status(error.statusCode).send({ message: error.message });
    });
};

const getUserById = (req, res) => {
  const { userID } = req.params;
  return User
    .findById(userID)
    .then((r) => {
      if (r === null) {
        const error = new NotFoundError('user not found');
        return res.status(error.statusCode).send({ message: error.message });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const error = new BadRequestError('invalid ID');
        return res.status(error.statusCode).send({ message: error.message });
      }
      const error = new DefaultError('server error');
      return res.status(error.statusCode).send({ message: error.message });
    });
};

const createUser = (req, res) => {
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
          let message = 'Ошибка валидации: ';
          if (error.errors) {
            Object.keys(error.errors).forEach((errorField) => {
              message += `${error.errors[errorField].message}; `;
            });
          } else {
            message += 'Произошла ошибка валидации данных';
          }
          res.status(400).send({ message });
        } else if (error.code === 11000) {
          res.status(409).send({ message: 'такой email уже используется' });
        } else {
          const serverError = new DefaultError('Ошибка сервера');
          res.status(serverError.statusCode).send({ message: serverError.message });
        }
      }))
    .catch(() => {
      const serverError = new DefaultError('Ошибка сервера');
      res.status(serverError.statusCode).send({ message: serverError.message });
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
        const notFoundError = new NotFoundError('User not found');
        res.status(notFoundError.statusCode).send({ message: notFoundError.message });
      } else {
        res.status(200).send(updatedUser);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const validationError = new BadRequestError('Validation Error');
        res.status(validationError.statusCode).send({ message: validationError.message });
      } else {
        const serverError = new DefaultError('Internal Server Error');
        res.status(serverError.statusCode).send({ message: serverError.message });
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
        const notFoundError = new NotFoundError('User not found');
        res.status(notFoundError.statusCode).send({ message: notFoundError.message });
      } else {
        res.status(200).send(updatedUser);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const validationError = new BadRequestError('Validation Error');
        res.status(validationError.statusCode).send({ message: validationError.message });
      } else {
        const serverError = new DefaultError('Internal Server Error');
        res.status(serverError.statusCode).send({ message: serverError.message });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        const notFound = new NotFoundError('пользователя не существует');
        res.status(notFound.statusCode).send({ message: notFound.message });
      } else {
        const token = jwt.sign(
          { _id: user._id },
          'some-secret-key',
          { expiresIn: '7d' },
        );
        res.status(200).send({ token });
      }
    })
    .catch(() => {
      const unauthorized = new DefaultError('Ошибка авторизации');
      res.status(unauthorized.statusCode).send({ message: unauthorized.message });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const notFound = new NotFoundError('пользователя не существует');
        res.status(notFound.statusCode).send({ message: notFound.message });
      } else {
        res.status(200).send(user);
      }
    })
    .catch(() => {
      const serverError = new DefaultError('Ошибка сервера');
      res.status(serverError.statusCode).send({ message: serverError.message });
    });
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