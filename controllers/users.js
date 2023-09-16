/* eslint-disable no-underscore-dangle */
/* eslint-disable eol-last */
const mongoose = require('mongoose');

const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;

const User = require('../models/user');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((e) => {
      if (e) {
        res.status(500).send({ message: 'Internal Server Error' });
      } else {
        res.status(404).send({ message: 'Users not found' });
      }
    });
};

const getUserById = (req, res) => {
  const { userID } = req.params;
  return User
    .findById(userID)
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'user not found' });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(400).send({ message: 'invalid ID' });
      }
      return res.status(500).send({ message: 'server error' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User
    .create({ name, about, avatar })
    .then((r) => res.status(201).send(r))
    .catch((e) => {
      // console.log(e);
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'invalid data' });
      }
      return res.status(500).send({ message: 'serverv error' });
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
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(200).send(updatedUser);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Validation Error' });
      } else {
        res.status(500).send({ message: 'Internal Server Error' });
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
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(200).send(updatedUser);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Validation Error' });
      } else {
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateAvatar,
  updateProfile,
};