require('dotenv').config();
const nodemailer = require("nodemailer");

// ----------------------------------------------------------------------------
// Gmail account credentials.

// ASSUMPTIONS:
// 1) Make sure to enable "Less Secure App Access"  on the Gmail account
// 2) 2FA is not enabled (or else we have to set an app password)
// 3) Credentials are stored in a filenamed `.env` in the top directory. Must
//    be formatted as follows:
//    GMAIL_USER='yourGmailAccount@gmail.com'
//    GMAIL_PASS='yourGmailPassword'

function gmailUser() {
  return process.env.GMAIL_USER;
}

function gmailPass() {
  return process.env.GMAIL_PASS;
}

// ----------------------------------------------------------------------------

async function sendEmailFromGmail(expertInfo) {
  // Taken from https://blog.mailtrap.io/nodemailer-gmail/

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser(), // gmail account to send from
      pass: gmailPass(), // password of said gmail account
    },
  });

  const mailOptions = {
    from: `"Expert Finder" <${gmailUser()}>`,
    to: `${expertInfo.ContactInfo.Email}`,
    subject: "Activate your Expert Finder Account!", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = {
  sendEmailFromGmail
};
