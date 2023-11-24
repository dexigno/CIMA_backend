const mongoose = require('mongoose');
const validator = require('validator');
const { ROLES, GENDERS } = require('../constants');
const bcrypt = require('bcrypt');
const { generateRandomString, encrypt } = require('../utils/helpers');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is Required'],
    },
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Not a valid Email'],
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      select: false,
      minlength: [6, 'Password should be atleast 6 characters long'],
      trim: true,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (cp) {
          return cp === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    gender: {
      type: String,
      enum: [GENDERS.MALE, GENDERS.FEMALE],
    },
    role: {
      type: String,
      required: [true, 'User Role is missing'],
      default: ROLES.DOCTOR,
      enum: [ROLES.DOCTOR, ROLES.PATIENT, ROLES.ADMIN, ROLES.MANAGER],
    },
    verified: {
      type: Boolean,
      default: false,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    image: String,
    imageKey: {
      type: String,
      select: false,
    },
    encryptedPassword: {
      type: String,
      select: false,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    phone: String,
    speciality: String,
    businessName: String,
    estimatedPatients: String,
    weight: Number,
    activityLevel: String,
    street: String,
    state: String,
    city: String,
    zip: Number,
    verificationOtp: Number,
    verificationOtpExpires: String,
    passwordResetOtp: Number,
    passwordResetOtpExpires: String,
    passwordResetToken: String,
  },
  { timestamps: true },
);

userSchema.statics.registerUser = async function (payload) {
  const createdUser = await this.create(payload);
  if (createdUser) return createdUser;
};

userSchema.statics.createPatient = async function (payload) {
  const password = generateRandomString(6);
  const encryptedPassword = password;
  if (!payload.name) {
    throw Error('The name is required');
  }
  if (!payload.email) {
    throw Error('Email is required');
  }

  const createdPatient = await this.create({
    ...payload,
    password,
    confirmPassword: password,
    role: ROLES.PATIENT,
    encryptedPassword,
    verfied: true,
  });
  if (createdPatient) return createdPatient;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.createVerificationOTP = function () {
  const verificationOTP = Math.floor(Math.random() * Math.pow(10, 6));
  this.verificationOtp = verificationOTP;
  this.verificationOtpExpires = Date.now() + 60 * 60 * 1000;

  return verificationOTP;
};

userSchema.methods.isCorrectPassword = async function (userPassword, hashedPassword) {
  return await bcrypt.compare(userPassword, hashedPassword);
};

userSchema.methods.createResetPasswordOTP = function () {
  const resetOTP = Math.floor(Math.random() * Math.pow(10, 6));

  this.passwordResetOtp = resetOTP;
  this.passwordResetOtpExpires = Date.now() + 10 * 60 * 1000;

  return resetOTP;
};

// METHODS FOR CHECKING PASSWORD CHANGE AFTER token ISSUED
userSchema.methods.PasswordChangedAfter = function (jwtIssuedTime) {
  if (this.passwordChangedAt) {
    const _passwordChangedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtIssuedTime < _passwordChangedAt;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
