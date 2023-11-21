const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/verify-otp/:otp', authController.verifyOtp);
router.patch('/resend-verification-otp', authController.resendOtp);

router.post('/forget-password', authController.forgotPassword);
router.post('/verify-fp-otp/:otp', authController.VerifyForgetPasswordOtp);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
