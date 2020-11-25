module.exports = function() {
  var express = require('express');
  var router = express.Router();
  const DATABASE_FILENAME = 'database/db.json';
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
        "profileCreationForm.js",
        "searchResponse.js"
      ]
    };

    res.render('createProfile', context);

  });

  router.get('/success', (req, res) => {
    const context = {"email": req.query.email};

    res.render('createProfileSuccess', context)
  })
     
  router.post('/', upload.single(HTML_NAME_ATTR_OF_IMG_INPUT), function(req, res) {
    let callbacks = [new Callback(readDatabase, runCallbacksAfterRead)];
    let db = null;
    const USER_FORM = JSON.parse([JSON.stringify(req.body)]);
    const IMG_FILE_TMP_PATH = (req.file) ? req.file.path : null;
    let imgFileTargetPath = null;

    Callback.runCallbacks(callbacks);

    // ------------------------------------------------------------------------
    // 1st level of callbacks

    // Read the database from the file and save store it in `db`.
    function readDatabase(complete, actionIfLastCallback) {
      fs.readFile(DATABASE_FILENAME, (err, data) => {
        if (err) handleError(err, res);  // failed read of database file
        else {
          db = JSON.parse(data);
          imgFileTargetPath = `${IMG_DIR}/profile-picture-user-id-${db['NextID']}.png`;
          complete(actionIfLastCallback);
        }
      });
    }

    function runCallbacksAfterRead() {
      let callbacks = [
        new Callback(writeDatabase, redirectToSuccessPage),
        new Callback(saveImage, redirectToSuccessPage),
        new Callback(sendEmail, redirectToSuccessPage)
      ];
      Callback.runCallbacks(callbacks);
    }

    // ----------------------------------------
    // 2nd level of callbacks

    function writeDatabase(complete, actionIfLastCallback) {
      console.log("Writing user creation form data to database.");
      db = createNewUser(db); // uses db from enclosing scope

      fs.writeFile(DATABASE_FILENAME, JSON.stringify(db, null, 4), err => {
        if (err) handleError(err, res);
        else complete(actionIfLastCallback);
      });
    }

    function saveImage(complete, actionIfLastCallback) {
      console.log("Saving image from user creation form to server.");
      if (IMG_FILE_TMP_PATH === null) complete(actionIfLastCallback);
      else {
        fs.rename(IMG_FILE_TMP_PATH, imgFileTargetPath, err =>  {
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
      res.redirect(`createProfile/success?email=${req.body.email}`);
      res.end();
    }

    // -------------------------
    // 2nd level callback helpers
    function createNewUser(database) {
      let newUser = {
        "Id":database['NextID'],
        "Name":USER_FORM["name"],
        "TechSkills": TagifyBackend.getTagsAsArray(USER_FORM['tech-skills']),
        "Coursework": TagifyBackend.getTagsAsArray(USER_FORM['coursework']),
        "Industry": TagifyBackend.getTagsAsArray(USER_FORM['industry']),
        "ContactInfo":{
          "Email":USER_FORM['email'],
          "Github":USER_FORM['github'],
          "Linkedin":USER_FORM['linkedin'],
          "Twitter":USER_FORM['twitter']
        },
        "ProfilePicture": imgFileTargetPath // from readDatabase()
      };

      // Chose to use NextID instead of length in case of expert deletion. If
      // we alloweddeletion we may get duplicate IDs and accidentally overwrite
      // an existing expert.
      database['Experts'].push(newUser);
      database['NextID']++;
      return database;
    }
  });

  return router;
}();
