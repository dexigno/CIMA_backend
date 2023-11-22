const User = require('../model/user');

const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/ErrorHandler');

const { sendEmail } = require('../services/email');
const { generateJWT } = require('../utils/generateJWT');
const { generateUniqueToken } = require('../utils/Token');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return next(new ErrorHandler('Mandatory Fields Missing.', 400));
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
        message: `Here is your 6 digit verification OTP: ${verificationOTP}.
Use this  OTP Verification of your CIMA Account.Please verify your account before 60 mins`,
      };

      await sendEmail(options);

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

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new ErrorHandler('Incorrect email or password.', 400));
  }

  if (!user.verified) {
    return next(new ErrorHandler('User Not Verified', 400));
  }

  const token = generateJWT(user._id);

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
    return next(new ErrorHandler('Invalid OTP . Please Check Again', 400));
  }

  let token;

  if (user) {
    token = generateJWT(user._id);
  }

  if (user.verificationOtpExpires && user.verificationOtpExpires < Date.now()) {
    return next(new ErrorHandler('Verification code has expired. Please request a new one.', 400));
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

  const _verificationOTP = await user.createVerificationOTP();

  await user.save({ validateBeforeSave: false });
  try {
    const options = {
      userEmail: user.email,
      subject: 'Cima Systems | OTP Verification',
      message: `Here is your 6 verification digit OTP: ${_verificationOTP}.
Use this  OTP Verification of your CIMA Account.Please verify your account before 60 mins`,
    };

    await sendEmail(options);
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler('User does not Exist', 400));
  }

  const resetPasswordOtp = await user.createResetPasswordOTP();
  await user.save({ validateBeforeSave: false });

  try {
    const options = {
      userEmail: user.email,
      subject: 'Cima Systems | Forget Password OTP ',
      message: `Here is your 6 digit verification OTP: ${resetPasswordOtp}.
Use this  OTP to Reset your password of your CIMA Account.`,
    };

    await sendEmail(options);
    return res.status(200).json({
      status: 'success',
      message: 'Please check your mail for  OTP',
    });
  } catch (error) {
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log('Email_sending_error', error.message);
    return next(new ErrorHandler('Error while sending email! Please try again later.', 400));
  }
});

exports.VerifyForgetPasswordOtp = catchAsync(async (req, res, next) => {
  const { otp } = req.params;
  const user = await User.findOne({
    passwordResetOtp: otp,
    passwordResetOtpExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler('Invalid OTP or has been expired.', 400));
  }

  const token = generateUniqueToken();
  user.passwordResetToken = token;
  user.save({ validateBeforeSave: false });

  return res.status(200).json({
    status: 'success',
    message: 'Otp verified! Reset your password now.',
    data: {
      token,
    },
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;
  if (!password || !confirmPassword) {
    return next(new ErrorHandler('Passwords are required', 400));
  }

  //  check if the otp is valid or expires
  const user = await User.findOne({
    passwordResetToken: token,
    // passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler('Invalid Token.', 400));
  }

  if (user.passwordResetOtpExpires < Date.now()) {
    return next(new ErrorHandler('Otp expired.', 400));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetOtp = undefined;
  user.passwordResetOtpExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  return res.status(200).json({
    status: 'success',
    message: 'Password Reset Successful!',
  });
});
