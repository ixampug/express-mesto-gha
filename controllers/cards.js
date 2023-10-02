/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

const {
  ERR_BAD_REQUEST,
  ERR_NOT_FOUND,
  ERR_DEFAULT,
} = require('../utils/constants');

const handleErrors = (res, err) => {
  if (err.name === 'ValidationError') {
    res.status(ERR_BAD_REQUEST).send({ message: 'Validation Error' });
  } else if (err.name === 'CastError') {
    res.status(ERR_BAD_REQUEST).send({ message: 'Request Error' });
  } else {
    res.status(ERR_DEFAULT).send({ message: 'Internal Server Error' });
  }
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

const getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERR_NOT_FOUND).send({ message: 'Card not found' });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERR_NOT_FOUND).send({ message: 'Card not found' });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERR_NOT_FOUND).send({ message: 'Card not found' });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

module.exports = {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
