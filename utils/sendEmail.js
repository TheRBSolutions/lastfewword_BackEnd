const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME || 'abrehmanfrontenddev@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'evtj isac bope ssml',
    },
  });

  const mailOptions = {
    from: "abrehmanfrontenddev@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });

};

module.exports = sendEmail;
