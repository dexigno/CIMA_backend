const nodemailer = require('nodemailer');

const sendEmail = async () => {
  try {
    const mailOptions = {
      userEmail: `amoizj16@gmail.com`,
      subject: 'Cima Systems | Customer Support - Beta Version',
      message: `Please reset your password before proceeding with Login.`,
    };

    const transporter = await nodemailer.createTransport({
      host: 'mail.cimasystem.com',
      secure: true,
      port: 465,
      auth: {
        user: 'support@cimasystem.com',
        pass: 'Support@123#@!',
      },
    });
    await transporter.sendMail({
      from: `support@cimasystem.com`,
      to: mailOptions.userEmail,
      subject: mailOptions.subject,
      text: mailOptions.message,
    });

    console.log('Email Sent Successfully');
  } catch (error) {
    console.log('Email_sending_error', error.message);
    console.log('Error while Sending email');
  }
};

sendEmail();

// EMAIL_HOST=smtp.gmail.com
// EMAIL_PORT=465
// EMAIL_USERNAME=caremap123@gmail.com
// EMAIL_PASSWORD=uqztahzxsmkvvrjq

// # EMAIL_HOST=mail.cimasystem.com
// # EMAIL_PORT=465
// # EMAIL_USERNAME=support@cimasystem.com
// # EMAIL_PASSWORD=Support@123#@!
