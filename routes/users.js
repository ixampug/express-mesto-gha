const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userController = require('../controllers/users');

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), userController.getUserById);
router.get('/', userController.getUsers);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), userController.updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .pattern(/^https?:\/\/(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
}), userController.updateAvatar);

// GET /users/me - возвращает информацию о текущем пользователе
module.exports = router;
