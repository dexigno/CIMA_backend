const User = require('../model/user');

const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/ErrorHandler');

// const { sendEmail } = require('../services/email');
// const { generateJWT } = require('../utils/generateJWT');
// const { generateUniqueToken } = require('../utils/Token');

exports.createPatient = catchAsync(async (req, res, next) => {
  const { name, email, phone, gender, weight, activityLevel } = req.body;

  // const doctor = req.user._id;
  const user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler('Email already in use.'));
  }
  const doctor = req.user._id;
  const newPatient = await User.createPatient({
    ...req.body,
    doctor,
  });
  if (newPatient) {
    return res.status(201).json({
      status: 'success',
      message: 'Patient Created Successfully.',
      data: newPatient,
    });
  }
});
