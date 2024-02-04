const express = require('express');
// const authController = require('../controllers/auth');
const authService = require('../services/auth.service');

const router = express.Router();

router.post('/register', authService.register);
router.post('/login',authService.login);
router.use('/user',authService.verifyToken);

module.exports = router;