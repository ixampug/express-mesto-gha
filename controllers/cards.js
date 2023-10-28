/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');
const ErrorAPI = require('../errors/errors');

function createCard(req, res, next) {
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
      if (err.name === 'ValidationError') {
        next(ErrorAPI.badRequest('Ошибка валидации'));
      } else {
        next(ErrorAPI.default('Ошибка сервера'));
      }
    });
}

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      next(ErrorAPI.default('Ошибка сервера'));
    });
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(ErrorAPI.notFound('Карточки не существует'));
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(ErrorAPI.badRequest('Неверный запрос'));
      } else {
        next(ErrorAPI.default('Ошибка сервера'));
      }
    });
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(ErrorAPI.notFound('Карточки не существует'));
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(ErrorAPI.badRequest('Неверный запрос'));
      } else {
        next(ErrorAPI.default('Ошибка сервера'));
      }
    });
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(ErrorAPI.notFound('Карточки не существует'));
      } else if (card.owner.toString() !== userId) {
        next(ErrorAPI.forbidden('Вам нельзя удалить эту карточку'));
      } else {
        Card.deleteOne(card);
      }
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        next(ErrorAPI.notFound('Карточки не существует'));
      } else {
        res.status(200).send({ data: deletedCard });
      }
    })
    .catch(() => {
      next(ErrorAPI.default('Ошибка сервера'));
    });
}

module.exports = {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
