const User = require('../model/user');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsync = require('../utils/catchAsync');

exports.getMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  // console.log(user);

  if (!user) {
    return next(
      new ErrorHandler('User no longer available with that ID or may have been deleted.', 400),
    );
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});
