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
      "profileCreationDatabaseField.js",
      "profileCreationStructure.js",
      "tagify.min.js",
      "profileCreationTagifyCategory.js",
      "profileCreationTags.js",
      "profileCreationForm.js"
    ]
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
  createNewExpertFromUserForm();

  let callbacks = [new Callback(saveImage, redirectToSuccessPage),
                   new Callback(sendEmail, redirectToSuccessPage)];
  Callback.runCallbacks(callbacks);

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

  function createNewExpertFromUserForm() {
    console.log("Writing user creation form data to database.");
    return dbInterface.createExpert(
      name=userForm["name"],
      TechSkills=TagifyBackend.getTagsAsArray(userForm['tech-skills']),
      Coursework=TagifyBackend.getTagsAsArray(userForm['coursework']),
      Industry=TagifyBackend.getTagsAsArray(userForm['industry']),
      ContactInfo={
        "Email":userForm['email'],
        "Github":userForm['github'],
        "Linkedin":userForm['linkedin'],
        "Twitter":userForm['twitter']
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
    const emailAddress = userForm['email'];
    res.redirect(`createProfile/success?email=${emailAddress}`);
    res.end();
  }
});

module.exports = router;
