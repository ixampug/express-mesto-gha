/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');
const {
  NotFoundError, BadRequestError, ForbiddenError, DefaultError,
} = require('../errors/errors');

const createCard = (req, res, next) => {
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
        next(new BadRequestError('Ошибка валидации'));
      } else {
        next(new DefaultError('Ошибка сервера'));
      }
    });
};

const getCards = (req, res, next) => {
  Card.find()
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      next(new DefaultError('Ошибка сервера'));
    });
};

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Card not found'));
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('неправильный запрос'));
      } else {
        next(new DefaultError('Ошибка сервера'));
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
        next(new NotFoundError('Card not found'));
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('неправильный запрос'));
      } else {
        next(new DefaultError('Ошибка сервера'));
      }
    });
}

async function deleteCard(req, res, next) {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карточки не существует');
    }
    if (card.owner.toString() !== userId) {
      throw new ForbiddenError('Вам нельзя удалить эту карточку');
    }
    const deletedCard = await Card.deleteOne(card);
    if (!deletedCard) {
      throw new NotFoundError('Карточки не существует');
    }
    res.status(200).send({ data: deletedCard });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
