const router = require('express').Router();
const userController = require('../controllers/users');

router.post('/users', userController.createUser);
router.get('/users/:userID', userController.getUserById);
router.get('/users', userController.getUsers);
router.patch('/me', userController.updateProfile);
router.patch('/me/avatar', userController.updateAvatar);

module.exports = router;