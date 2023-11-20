const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { authProtect } = require('../middleware/authProtect');

router.use(authProtect);

router.get('/me', userController.getMe);

module.exports = router;
