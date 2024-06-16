const express = require('express');
// const authController = require('../controllers/auth');
const authService = require('../services/auth.service');
const { verifyToken } = require('../middlewares/auth.middleware');


const router = express.Router();

router.post('/register', authService.register);
router.post('/login',authService.login);
router.post('/refresh',authService.refresh);
router.post('/logout', verifyToken, authService.logout)


module.exports = router;