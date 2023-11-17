const User = require('../model/user');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsync = require('../utils/catchAsync');
const { generateToken } = require('../utils/generateToken');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return next(new ErrorHandler('Mandotory Fields Missing.'));
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(new ErrorHandler('User already Exist.'));
  }

  const newUser = await User.registerUser({
    ...req.body,
  });
  let token;
  if (newUser) {
    token = generateToken(newUser._id);
  }
  return res.status(201).json({
    status: 'success',
    message: 'User Registered Successfully.',
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please enter email or password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new ErrorHandler('Incorrect email or password.', 400));
  }

  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Sucessfully Logged In',
    token,
  });
});
