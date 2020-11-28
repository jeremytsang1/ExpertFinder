require('dotenv').config();

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

function sendEmail(emailAddress, expertInfo) {
}

module.exports = {
  sendEmail
};
