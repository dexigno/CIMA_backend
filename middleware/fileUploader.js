const awsS3Service = require('../services/s3Service');
const uuid = require('uuid');
const path = require('path');
const ErrorHandler = require('../utils/ErrorHandler');
const { S3BUCKET_FOLDERS } = require('../constants');
const catchAsync = require('../utils/catchAsync');

exports.uploadImageFunction = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const fileBuffer = req.file.buffer;
  const fileName = path.parse(req.file.originalname).name;
  const fileExt = path.parse(req.file.originalname).ext;
  const fileId = uuid.v4();
  const bucket = S3BUCKET_FOLDERS.ID_PICTURES;
  const mimetype = req.file.mimetype;

  const uploadPromises = [
    awsS3Service.uploadFileThroughStream(fileBuffer, fileId, fileName, fileExt, bucket, mimetype),
  ];

  const uploadedFiles = await Promise.all(uploadPromises);

  if (uploadedFiles && uploadedFiles.length > 0) {
    const imageURL = await awsS3Service.getPublicImageUrl(uploadedFiles[0].Key);

    req.imageURL = imageURL;
    req.imageKey = uploadedFiles[0].Key;
    next();
  }
});
