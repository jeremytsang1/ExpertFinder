module.exports = function() {
  var express = require('express');
  var router = express.Router();
  const DATABASE_FILENAME = 'database/db.json';
  const fs = require('fs');
  const {Callback} = require('../util/callback');

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
     
  router.post('/', function(req, res) {
    let callbacks = [new Callback(readDatabase, runCallbacksAfterRead)];
    let db = undefined;

    Callback.runCallbacks(callbacks);

    // ------------------------------------------------------------------------
    // 1st level of callbacks

    // Read the database from the file and save store it in `db`.
    function readDatabase(complete, actionIfLastCallback) {
      fs.readFile(DATABASE_FILENAME, (err, data) => {
        if (err) handleError(err, res);  // failed read of database file
        else {
          db = JSON.parse(data);
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
      db = createNewUser(req, db); // uses db from enclosing scope

      fs.writeFile(DATABASE_FILENAME, JSON.stringify(db, null, 4), err => {
        if (err) handleError(err, res);
        else complete(actionIfLastCallback);
      });
    }

    function saveImage(complete, actionIfLastCallback) {
      // TODO
      console.log("Saving image from user creation form to server.");
      complete(actionIfLastCallback);
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
  });

  function createNewUser(req, database) {
    let userForm = [JSON.stringify(req.body)];
    uF = JSON.parse(userForm)

    let processTagify = (tagifyData) => {
      if (tagifyData !== "") return JSON.parse(tagifyData).map(elt => elt['value']);
      else [];
    };

    // JSON.parse(req.body) will have data from the <form>

    let newUser = {
      "Id":database['NextID'],
      "Name":uF["name"],
      "TechSkills":processTagify(uF['tech-skills']),
      "Coursework":processTagify(uF['coursework']),
      "Industry": processTagify(uF['industry']),
      "ContactInfo":{
        "Email":uF['email'],
        "Github":uF['github'],
        "Linkedin":uF['linkedin'],
        "Twitter":uF['twitter']
      },
      "ProfilePicture":uF['profile-picture']
    };

    // add stuff to newUser
    database['Experts'].push(newUser);
    database['NextID']++;
    console.log("NEXT ID:", database['NextID'])
    return database;
  }

  return router;
}();
