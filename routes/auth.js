const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/verify-otp/:otp', authController.verifyOtp);
router.patch('/resend-verification-otp', authController.resendOtp);

module.exports = router;
