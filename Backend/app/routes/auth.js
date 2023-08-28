const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller')
router.post('/login', authController.login);
router.post('/recovery', authController.recoverPassword);
router.post('/validate/recovery', authController.validateRecoverCode);
router.post('/reset', authController.changePassword);

module.exports = router;