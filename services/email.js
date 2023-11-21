const { appConfig } = require('../config');
const nodemailer = require('nodemailer');

exports.sendEmail = async (mailOptions) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = await nodemailer.createTransport({
    service: 'gmail',
    host: appConfig.EMAIL_HOST,
    secure: true,
    port: appConfig.EMAIL_PORT,
    auth: {
      user: appConfig.EMAIL_USERNAME,
      pass: appConfig.EMAIL_PASSWORD,
    },
  });
  transporter.sendMail({
    from: `Verification Email`,
    to: mailOptions.userEmail,
    subject: mailOptions.subject,
    text: mailOptions.message,
    // html: OTP_TEMPLATE(mailOptions.message),
  });
};
