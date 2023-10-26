const router = require('express').Router();
const userController = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');

router.get('/:userID', authMiddleware, userController.getUserById);
router.get('/', authMiddleware, userController.getUsers);
router.patch('/me', authMiddleware, userController.updateProfile);
router.patch('/me/avatar', authMiddleware, userController.updateAvatar);

// GET /users/me - возвращает информацию о текущем пользователе
module.exports = router;
