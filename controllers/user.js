const User = require('../model/user');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsync = require('../utils/catchAsync');

exports.getMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(
      new ErrorHandler('User no longer available with that ID or may have been deleted.', 400),
    );
  }

  return res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.UpdateIDPic = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(
      new ErrorHandler('User no longer available with that ID or may have been deleted.', 400),
    );
  }

  const imageURL = req.imageURL;
  const imageKey = req.imageKey;

  if (!imageURL) {
    return next(new ErrorHandler('Image Not Uploaded.', 400));
  }

  user.image = imageURL;
  user.imageKey = imageKey;
  user.save();

  return res.status(200).json({
    status: 'success',
    data: imageURL,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(
      new ErrorHandler('User no longer available with that ID or may have been deleted.', 400),
    );
  }

  const restrictedKeys = [
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
  ];

  restrictedKeys.forEach((field) => {
    if (req.body.hasOwnProperty(field)) {
      delete req.body[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate({ _id: req.user._id }, req.body, {
    new: true,
    runValidators: true,
  }).select('-__v -createdAt -updatedAt -role -image');

  if (!updatedUser) {
    return next(new ErrorHandler('No User found with that ID', 400));
  }
  return res.status(201).json({
    status: 'success',
    user: updatedUser,
  });
});

// exports.deleteMe = catchAsync(async (req, res, next) => {
//   await User.findByIdAndUpdate(
//     { _id: req.user._id },
//     {
//       $set: {
//         isDeleted: true,
//       },
//     },
//     { new: true },
//   );

//   return res.status(201).json({
//     status: 'success',
//     message: 'User deleted successfully.',
//   });
// });
