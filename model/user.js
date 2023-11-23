const mongoose = require('mongoose');
const validator = require('validator');
const { constants } = require('../constants');
const bcrypt = require('bcrypt');

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
      enum: [constants.GENDERS.MALE, constants.GENDERS.FEMALE],
    },
    role: {
      type: String,
      required: [true, 'User Role is missing'],
      default: constants.ROLES.DOCTOR,
      enum: [
        constants.ROLES.DOCTOR,
        constants.ROLES.PATIENT,
        constants.ROLES.ADMIN,
        constants.ROLES.MANAGER,
      ],
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
    phone: String,
    speciality: String,
    businessName: String,
    estimatedPatients: String,
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
