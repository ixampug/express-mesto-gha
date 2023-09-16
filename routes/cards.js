const express = require('express');

const router = express.Router();
const cardsController = require('../controllers/cards');

router.get('/', cardsController.getCards);
router.post('/', cardsController.createCard);
router.put('/:cardId/likes', cardsController.likeCard);
router.delete('/:cardId/likes', cardsController.dislikeCard);
router.delete('/:cardId', cardsController.deleteCard);

module.exports = router;