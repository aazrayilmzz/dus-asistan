const express = require('express');
const authenticate = require('../../middleware/auth.middleware');
const authController = require('./auth.controller');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);
router.patch('/me', authenticate, authController.updateProfile);

module.exports = router;
