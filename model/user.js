const mongoose = require('mongoose');
const validator = require('validator');
const { constants } = require('../constants');
const bcryt = require('bcrypt');

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
    phone: String,
    speciality: String,
    businessName: String,
    estimatedPatients: String,
    street: String,
    state: String,
    city: String,
    zip: Number,
  },
  { timestamps: true },
);

userSchema.statics.registerUser = async function (payload) {
  const createdUser = await this.create(payload);
  if (createdUser) return createdUser;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcryt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.isCorrectPassword = async function (userPassword, hashedPassword) {
  return await bcryt.compare(userPassword, hashedPassword);
};

module.exports = mongoose.model('User', userSchema);
