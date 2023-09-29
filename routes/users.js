const router = require('express').Router();
const userController = require('../controllers/users');

router.post('/', userController.createUser);
router.get('/:userId', userController.getUserById);
router.get('/', userController.getUsers);
router.patch('/me', userController.updateProfile);
router.patch('/me/avatar', userController.updateAvatar);

module.exports = router;
