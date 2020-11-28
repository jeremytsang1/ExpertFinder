require('dotenv').config();
const nodemailer = require("nodemailer");
const os = require('os');
const PORT_NUM = 3500

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
    subject: "Activate your Expert Finder Account!",
    text: makeTextMessage(expertInfo)
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

function makeTextMessage(expertInfo) {
  return (
    ""
      + "\n" + "An account for an expert with the following will be created."
      + "\n"
      + "\n" + `TechSkills: ${expertInfo.TechSkills}`
      + "\n" + `Coursework: ${expertInfo.Coursework}`
      + "\n" + `Industry: ${expertInfo.Industry}`
      + "\n" + `Email: ${expertInfo.ContactInfo.Email}`
      + "\n" + `Github: ${expertInfo.ContactInfo.Github}`
      + "\n" + `LinkedIn: ${expertInfo.ContactInfo.Linkedin}`
      + "\n" + `Twitter: ${expertInfo.ContactInfo.Twitter}`
      + "\n" + `StackOverflow: ${expertInfo.ContactInfo.Stackoverflow}`
      + "\n"
      + "\n" + "If you want to activate your account click the following link, "
      +        "otherwise please disregard this message."
      + "\n"
      + "\n" + `${makeLink(expertInfo)}`
      + "\n"
      + "\n" + `${makeFooter()}`
  );
}

function makeLink(expertInfo) {
  const baseUrl = `http://${os.hostname()}:${PORT_NUM}`;
  let route = `activateProfile?Id=${expertInfo.Id}`;
  return `${baseUrl}/${route}`;
}

function makeFooter() {
  // Append the current time of the message to the end to prevent folding the
  // content by Gmail. Strategy taken from: https://stackoverflow.com/a/14585963
  const date = new Date();
  const hours = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  return `[${hours}:${min}:${sec} ${month}/${day}/${year}] End of message.`;
}

module.exports = {
  sendEmailFromGmail
};
