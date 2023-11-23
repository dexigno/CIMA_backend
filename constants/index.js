exports.RUNNING_ENVIRONMENTS = Object.freeze({
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
});

exports.GENDERS = Object.freeze({
  MALE: 'male',
  FEMALE: 'female',
});

exports.ROLES = Object.freeze({
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  ADMIN: 'admin',
  MANAGER: 'manager',
});

exports.S3BUCKET_FOLDERS = Object.freeze({
  ID_PICTURES: 'id-pictures',
});

exports.UPDATE_RESTRICTED_KEYS = Object.freeze([
  'verified',
  'isDeleted',
  'role',
  'image',
  'imageKey',
  'email',
  'password',
  'verificationOtp',
  'verificationOtpExpires',
  'passwordResetOtp',
  'passwordResetOtpExpires',
  'passwordResetToken',
]);
