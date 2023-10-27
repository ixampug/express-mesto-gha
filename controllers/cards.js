/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');
const ErrorAPI = require('../errors/errors');

function createCard(req, res, next) {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  }, (err, card) => {
    if (err) {
      if (err.name === 'ValidationError') {
        return next(ErrorAPI.badRequest('Ошибка валидации'));
      }
      return next(ErrorAPI.default('Ошибка сервера'));
    }
    return res.status(201).send(card);
  });
}

function getCards(req, res, next) {
  Card.find({}, (err, cards) => {
    if (err) {
      return next(ErrorAPI.default('Ошибка сервера'));
    }
    return res.status(200).send(cards);
  });
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
    (err, card) => {
      if (err) {
        if (err.name === 'CastError') {
          return next(ErrorAPI.badRequest('Неверный запрос'));
        }
        return next(ErrorAPI.default('Ошибка сервера'));
      }
      if (!card) {
        return next(ErrorAPI.notFound('Карточки не сущестсует'));
      }
      return res.status(200).send(card);
    },
  );
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
    (err, card) => {
      if (err) {
        if (err.name === 'CastError') {
          return next(ErrorAPI.badRequest('Неверный запрос'));
        }
        return next(ErrorAPI.default('Ошибка сервера'));
      }
      if (!card) {
        return next(ErrorAPI.notFound('Карточки не сущестсует'));
      }
      return res.status(200).send(card);
    },
  );
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById(cardId, (err, card) => {
    if (err) {
      return next(ErrorAPI.default('Ошибка сервера'));
    }
    if (!card) {
      return next(ErrorAPI.notFound('Карточки не сущестсует'));
    }
    if (card.owner.toString() !== userId) {
      return next(ErrorAPI.forbidden('Вам нельзя удалить эту карточку'));
    }
    // eslint-disable-next-line no-shadow
    return Card.deleteOne(card, (err, deletedCard) => {
      if (err) {
        return next(ErrorAPI.default('Ошибка сервера'));
      }
      if (!deletedCard) {
        return next(ErrorAPI.notFound('Карточки не сущестсует'));
      }
      return res.status(200).send({ data: deletedCard });
    });
  });
}

module.exports = {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
