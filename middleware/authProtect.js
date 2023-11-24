const { appConfig } = require('../config');
const User = require('../model/user');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken');

exports.authProtect = catchAsync(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('B')) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ErrorHandler('Please login to get access.', 401));
  }

  const decoded = jwt.verify(token, appConfig.JWT_SECRET);

  const verifiedUser = await User.findOne({
    _id: decoded.id,
  });
  if (!verifiedUser) {
    return next(new ErrorHandler('User no longer available. Please login again'));
  }
  if (verifiedUser.isDeleted) {
    return next(new ErrorHandler('User no longer available. '));
  }

  // PROTECT USER TO RESET_PASSWORD AFTER TOKEN ISSUED
  const isPasswordChangedAfter = await verifiedUser.PasswordChangedAfter(decoded.iat);

  if (isPasswordChangedAfter) {
    return next(new ErrorHandler('User recently changed their password. Please login again!', 401));
  }

  req.user = verifiedUser;
  next();
});
