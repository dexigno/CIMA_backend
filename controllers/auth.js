const User = require('../model/user');

const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/ErrorHandler');

const { sendVerificationEmail } = require('../services/email');
const { generateToken } = require('../utils/generateToken');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return next(new ErrorHandler('Mandatory Fields Missing.'));
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(new ErrorHandler('User already exists.'));
  }

  const newUser = await User.registerUser({
    ...req.body,
  });

  if (newUser) {
    const verificationOTP = await newUser.createVerificationOTP();

    await newUser.save({ validateBeforeSave: false });
    try {
      const options = {
        userEmail: newUser.email,
        subject: 'Cima Systems | OTP Verification',
        message: `Here is your 6 verification digit OTP: ${verificationOTP}.
Use this  OTP Verification of your CIMA Account.Please verify your account before 60 mins`,
      };

      await sendVerificationEmail(options);

      return res.status(201).json({
        status: 'success',
        message: 'User Registered Successfully. Please check your mail for verification OTP',
      });
    } catch (error) {
      newUser.verificationOTP = undefined;
      newUser.verificationOtpExpires = undefined;
      await newUser.save({ validateBeforeSave: false });
      console.log('Email_sending_error', error.message);
      return next(new ErrorHandler('Error while sending email! Please try again later.', 400));
    }
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please enter email or password', 400));
  }
  const user = await User.findOne({ email }).select('+password +verified');

  // console.log(user);

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new ErrorHandler('Incorrect email or password.', 400));
  }

  if (!user.verified) {
    return next(new ErrorHandler('User Not Verified', 400));
  }

  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Sucessfully Logged In',
    token,
  });
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    verificationOtp: req.params.otp,
  });

  if (!user) {
    return next(new ErrorHandler('Invalid OTP . Please Check Again'));
  }

  let token;

  if (user) {
    token = generateToken(user._id);
  }

  if (user.verificationOtpExpires && user.verificationOtpExpires < Date.now()) {
    return next(new ErrorHandler('Verification code has expired. Please request a new one.'));
  }

  user.verificationOtp = undefined;
  user.verificationOtpExpires = undefined;
  user.verified = true;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    status: 'success',
    message: 'Otp verified! .',
    token,
  });
});

exports.resendOtp = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new ErrorHandler('User Not found'));
  }

  const verificationOTP = await user.createVerificationOTP();

  await user.save({ validateBeforeSave: false });
  try {
    const options = {
      userEmail: user.email,
      subject: 'Cima Systems | OTP Verification',
      message: `Here is your 6 verification digit OTP: ${verificationOTP}.
Use this  OTP Verification of your CIMA Account.Please verify your account before 60 mins`,
    };

    await sendVerificationEmail(options);
    return res.status(201).json({
      status: 'success',
      message: 'Please check your mail for verification OTP',
    });
  } catch (error) {
    user.verificationOTP = undefined;
    user.verificationOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log('Email_sending_error', error.message);
    return next(new ErrorHandler('Error while sending email! Please try again later.', 400));
  }
});
