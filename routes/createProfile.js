var express = require('express');
var router = express.Router();
const dbInterface = require('../database/db_interface');
const IMG_DIR = 'public/images';
const IMG_DIR_TMP = `${IMG_DIR}/tmp`
const fs = require('fs');
const http = require("http");
const path = require("path");
const multer = require("multer");
const upload = multer({
  dest: IMG_DIR_TMP  // directory to place temporary uploads
});
const {Callback} = require('../util/callback');
const HTML_NAME_ATTR_OF_IMG_INPUT = "profile-picture";
const {TagifyBackend} = require('../util/tagifyBackend')
const INVALID_EMAIL = "is already taken. Please enter a different email address.";

function handleError(err, res) {
  console.log(err);
  res.status(500).contentType("text/plain").end("Something went wrong!");
}

router.get('/', function(req, res) {
  var context = {
    cssstyles: [
      "public/css/tagify.css"
    ],
    jsscripts: [
      "tagify.min.js",
      "tagifyClientRequest.js",
      "profileCreationForm.js"
    ],
    errorMessage: req.query.errorMessage
  };

  res.render('createProfile', context);

});

router.get('/success', (req, res) => {
  const context = {"email": req.query.email};

  res.render('createProfileSuccess', context)
});

router.post('/', upload.single(HTML_NAME_ATTR_OF_IMG_INPUT), function(req, res) {
  const [imgFileTmpPath, imgFileTargetPath] = createProfilePicturePath();
  const userForm = JSON.parse([JSON.stringify(req.body)]);

  if (isEmailAlreadyTaken()) informUserEmailIsAlreadyTaken();
  else saveUserToDatabase();

  // ----------------------------------------
  // helpers

  function isEmailAlreadyTaken() {
    console.log("foo");
    const existingEmails = dbInterface.getAllEmails();
    const emailFromUser = userForm.Email;
    console.log(`existingEmails: ${existingEmails}`);
    console.log(`emailFromUser: ${emailFromUser}`);
    return existingEmails.includes(emailFromUser);
  }

  function informUserEmailIsAlreadyTaken() {
    let errorMessage = `${userForm.Email} ${INVALID_EMAIL}`;
    res.redirect(`createProfile?errorMessage=${errorMessage}`);
    res.end();
  }

  function saveUserToDatabase() {
    createNewExpertFromUserForm();
    let callbacks = [new Callback(saveImage, redirectToSuccessPage),
                     new Callback(sendEmail, redirectToSuccessPage)];
    Callback.runCallbacks(callbacks);
  }

  function createProfilePicturePath() {
    const tmpPath = (req.file) ? req.file.path : null;
    const newUserID = dbInterface.getExpertCount() + 1;
    const permPath = ((tmpPath !== null)
                      ? `${IMG_DIR}/id-${newUserID}.png`
                      : `${IMG_DIR}/female-default-profile-img.jpg`);
    return [tmpPath, permPath];
  }

  function createNewExpertFromUserForm() {
    console.log("Writing user creation form data to database.");
    return dbInterface.createExpert(
      Name=userForm.Name,
      TechSkills=TagifyBackend.getTagsAsArray(userForm.TechSkills),
      Coursework=TagifyBackend.getTagsAsArray(userForm.Coursework),
      Industry=TagifyBackend.getTagsAsArray(userForm.Industry),
      ContactInfo={
        "Email":userForm.Email,
        "Github":userForm.Github,
        "Linkedin":userForm.Linkedin,
        "Twitter":userForm.Twitter,
        "Stackoverflow": userForm.Stackoverflow
      },
      ProfilePicture=imgFileTargetPath);
  }

  // ----------------------------------------
  // callbacks

  function saveImage(complete, actionIfLastCallback) {
    console.log("Saving image from user creation form to server.");
    if (imgFileTmpPath === null) complete(actionIfLastCallback);
    else {
      fs.rename(imgFileTmpPath, imgFileTargetPath, err =>  {
        if (err) handleError()
        else complete(actionIfLastCallback);
      });
    }
  }

  function sendEmail(complete, actionIfLastCallback) {
    // TODO
    console.log("Sending activation email to user.");
    complete(actionIfLastCallback);
  }

  function redirectToSuccessPage() {
    const emailAddress = userForm.Email;
    res.redirect(`createProfile/success?email=${emailAddress}`);
    res.end();
  }
});

module.exports = router;
