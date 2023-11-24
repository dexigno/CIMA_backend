const User = require('../model/user');

const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/ErrorHandler');
const Factory = require('./Factory');

const { sendEmail } = require('../services/email');

exports.createPatient = catchAsync(async (req, res, next) => {
  const { email } = req.body;

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

exports.getPatients = Factory.getAllByDoctor(User);
exports.getPatient = Factory.getOne(User);
exports.updatePatient = Factory.updateOne(User);
exports.deletePatient = Factory.deleteOne(User);

exports.sendCredentials = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select('+encryptedPassword');
  if (!user) {
    return next(new ErrorHandler('No user Found with this email.'));
  }

  try {
    const options = {
      userEmail: user.email,
      subject: 'Cima Systems | Patient Credentials',
      message: `Here are your login Credentials for CIMA System.
Email: ${email}
Password: ${user.encryptedPassword}
`,
    };

    await sendEmail(options);

    return res.status(201).json({
      status: 'success',
      message: 'Credentials Sent to Patient',
    });
  } catch (error) {
    await newUser.save({ validateBeforeSave: false });
    console.log('Email_sending_error', error.message);
    return next(new ErrorHandler('Error while sending email! Please try again later.', 400));
  }
});
