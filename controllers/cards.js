/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');
// const ErrorAPI = require('../errors/errors');
// const handleErrors = require('../middlewares/handleErrors');
// const {
//   NOT_FOUND,
//   DEFAULT,
//   FORBIDDEN,
// } = require('../utils/constants');
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
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера' });
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
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'неправильный запрос' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
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
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'неправильный запрос' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
}

async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).send({ message: 'Карточки не существует' });
    }
    if (card.owner.toString() !== userId) {
      return res.status(403).send({ message: 'Вам нельзя удалить эту карточку' });
    }
    const deletedCard = await Card.deleteOne(card);
    if (!deletedCard) {
      return res.status(404).send({ message: 'Карточки не существует' });
    }
    return res.status(200).send({ data: deletedCard });
  } catch (err) {
    return res.status(500).send({ message: 'Ошибка сервера' });
  }
}

module.exports = {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
