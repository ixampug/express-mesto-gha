/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');
// const ErrorAPI = require('../errors/errors');
const handleErrors = require('../middlewares/handleErrors');
const {
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
} = require('../utils/constants');

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

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Card not found' });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      handleErrors(res, err);
    });
}

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Card not found' });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      handleErrors(res, err);
    });
}

async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Карточки не существует' });
    }
    if (card.owner.toString() !== userId) {
      return res.status(FORBIDDEN).send({ message: 'Вам нельзя удалить эту карточку' });
    }
    await Card.deleteOne(card);
    return res.status(200).send({ data: card });
  } catch (error) {
    return res.status(DEFAULT).send({ message: 'Ошибка сервера' });
  }
}

module.exports = {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
