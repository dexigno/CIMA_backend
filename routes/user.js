const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { authProtect } = require('../middleware/authProtect');

router.use(authProtect);
const multer = require('multer');
const { uploadImageFunction } = require('../middleware/fileUploader');

const uploadImageMiddleware = multer().single('image');

router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);
router.patch(
  '/upload-image',
  uploadImageMiddleware,
  uploadImageFunction,
  userController.UpdateIDPic,
);

module.exports = router;
