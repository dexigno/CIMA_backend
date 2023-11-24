const nodemailer = require('nodemailer');

const sendEmail = async () => {
  try {
    const mailOptions = {
      userEmail: `amoizj16@gmail.com`,
      subject: 'Cima Systems | Customer Support - Beta Version',
      message: `Dear User of Cima System, 
      
Just to inform you that please reset your password before proceeding with the Login of you account after an hour. 
The application is in the Process of upgrading.

Thanks
Team Cima
`,
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
      replyTo: 'jack.harris@logodesignflux.com',
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
// jack.harris@logodesignflux.com
