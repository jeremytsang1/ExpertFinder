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
const {sendEmailFromGmail} = require('../util/email');
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
    errorMessage: null
  };

  if (req.query.email) {
    context.errorMessage = `${req.query.email} ${INVALID_EMAIL}`;
  }

  res.render('createProfile', context);
});

router.get('/success', (req, res) => {
  const context = {"email": req.query.email};

  res.render('createProfileSuccess', context)
});

router.post('/', upload.single(HTML_NAME_ATTR_OF_IMG_INPUT), function(req, res) {
  // Closure variables
  const [imgFileTmpPath, imgFileTargetPath] = createProfilePicturePath();
  const userForm = JSON.parse([JSON.stringify(req.body)]);
  let expertInfo = getExpertInfoFromUser();

  if (isEmailAlreadyTaken()) informUserEmailIsAlreadyTaken();
  else saveUserToDatabase();

  // ----------------------------------------
  // helpers

  function createProfilePicturePath() {
    const tmpPath = (req.file) ? req.file.path : null;
    const newUserID = dbInterface.getExpertCount() + 1;
    const permPath = ((tmpPath !== null)
                      ? `${IMG_DIR}/id-${newUserID}.png`
                      : `${IMG_DIR}/female-default-profile-img.jpg`);
    return [tmpPath, permPath];
  }

  function getExpertInfoFromUser() {
    return {
      Id: null,
      Name: userForm.Name,
      TechSkills: TagifyBackend.getTagsAsArray(userForm.TechSkills),
      Coursework: TagifyBackend.getTagsAsArray(userForm.Coursework),
      Industry: TagifyBackend.getTagsAsArray(userForm.Industry),
      ContactInfo: {
        "Email":userForm.Email,
        "Github":userForm.Github,
        "Linkedin":userForm.Linkedin,
        "Twitter":userForm.Twitter,
        "Stackoverflow": userForm.Stackoverflow
      },
      ProfilePicture: imgFileTargetPath
    }
  }

  function isEmailAlreadyTaken() {
    const existingEmails = dbInterface.getAllEmails();
    return existingEmails.includes(expertInfo.ContactInfo.Email);
  }

  function informUserEmailIsAlreadyTaken() {
    res.redirect(`createProfile?email=${expertInfo.ContactInfo.Email}`);
    res.end();
  }

  function saveUserToDatabase() {
    expertInfo.Id = createNewExpertFromUserForm(); // call the API
    let callbacks = [new Callback(saveImage, redirectToSuccessPage),
                     new Callback(sendEmail, redirectToSuccessPage)];
    Callback.runCallbacks(callbacks);
  }

  function createNewExpertFromUserForm() {
    console.log("Writing user creation form data to database.");
    return dbInterface.createExpert(
      name=expertInfo.Name,
      TechSkills=expertInfo.TechSkills,
      Coursework=expertInfo.Coursework,
      Industry=expertInfo.Industry,
      ContactInfo=expertInfo.ContactInfo,
      ProfilePicture=expertInfo.ProfilePicture,
    );
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
    sendEmailFromGmail(expertInfo);
    complete(actionIfLastCallback);
  }

  function redirectToSuccessPage() {
    const emailAddress = userForm.Email;
    res.redirect(`createProfile/success?email=${emailAddress}`);
    res.end();
  }
});

module.exports = router;
