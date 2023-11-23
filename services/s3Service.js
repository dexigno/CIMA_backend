const { S3 } = require('aws-sdk');
const { appConfig } = require('../config');

const config = {
  aws: {
    accessKeyId: appConfig.AWS_ACCESS_KEY,
    accessKeySecret: appConfig.AWS_SECRET_ACCESS_KEY,
    s3Bucket: appConfig.AWS_BUCKET_NAME,
    accessPoint: appConfig.AWS_BUCKET_REGION,
  },
};

const s3Config = {
  signatureVersion: 'v4',
  // region: config.aws.region,
  s3ForcePathStyle: true,
};

if (config.aws.accessKeyId && config.aws.accessKeySecret) {
  s3Config.accessKeyId = config.aws.accessKeyId;
  s3Config.secretAccessKey = config.aws.accessKeySecret;
  s3Config.accessPoint = config.aws.accessPoint;
}

// S3Client

const s3 = new S3(s3Config);

exports.uploadFileThroughStream = (fileBuffer, uuid, fileName, fileExt, bucket, mimetype) => {
  const sanitized = fileName.replace(/[^A-Za-z0-9]/gi, '_').toLowerCase();
  const fileKey = `${uuid}-${sanitized}${fileExt}`;
  const params = {
    Bucket: `${config.aws.s3Bucket}/${bucket}`,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: `${mimetype}`,
    ContentDisposition: `inline; filename=${fileName}.${fileExt}`,
    ACL: 'public-read',
  };

  return s3.upload(params).promise();
};

exports.getPublicImageUrl = (key) => {
  if (!key) {
    return;
  }
  return `${appConfig.AWS_BASE_URL}/${key}`;
};
