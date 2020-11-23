module.exports = function() {
  var express = require('express');
  var router = express.Router();
  const DATABASE_FILENAME = 'database/db.json';
  const fs = require('fs');

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
    var qParams = [];
    var callbackCountRead = 0;

    // for (var p in req.body) {
        // qParams.push(JSON.stringify({'first-name':p, 'value':req.body[p]}))
    // }
    // console.log(qParams);

     // writing to a file code is based on https://stackabuse.com/writing-to-files-in-node-js/


    var newProfile = JSON.stringify(req.body);

    // console.log(req.body);
    // console.log("PPPPPOOOOOOOSSSSSTTT");
    var context = {};
    // context.dataList = qParams;

    readDatabase(completeRead);

    function completeRead(req, res, data, completeWrite) {
      callbackCountRead++;
      if (callbackCountRead >= 1) {
        writeDatabase(req, res, data, completeWrite);
      }
    }

    function readDatabase(completeRead) {
      var callbackCountWrite = 0;

      fs.readFile(DATABASE_FILENAME, (err, data) => {
        if (err) console.log(err);  // failed read of database file
        else completeRead(req, res, data, completeWrite);   // successful read of the database file
      });

      function completeWrite() {
        callbackCountWrite++;
        if (callbackCountWrite >= 1) {
          res.redirect(`createProfile/success?email=${req.body.email}`);
          res.end();
        }
      }
    }
  });

  function createNewUser(req, data) {

    let userForm = [JSON.stringify(req.body)];
    uF = JSON.parse(userForm)
    // console.log(uF); 
    // console.log("NAME =", uF['name'])

    let techSkills = JSON.parse(uF['tech-skills']); 
    console.log('TECH SKILLS', techSkills);

    let techArray = Object.values(techSkills);

    console.log(techArray);

    // function () {
    //   for (i=0; i < techSkills.length; i++) {
    //     techArray.push(techSkills[i])
    //   }
    // };


    // JSON.parse(req.body) will have data from the <form>
    let db = JSON.parse(data); //  will have old data from the database.
    let newUser = {"Id":db['NextID'],"Name":uF["name"],"TechSkills": uF['tech-skills'],"Coursework": uF['coursework'],"Industry": uF['industry'],"ContactInfo":{"Email":uF['email'],"Github":uF['github'],"Linkedin":uF['linkedin'],"Twitter":uF['twitter']},"ProfilePicture":uF['profile-picture']};

    // db['Experts'] = [];
    // console.log(db['Experts']);

    
    // add stuff to newUser
    db['Experts'].push(newUser);
    db['NextID']++;
    console.log("NEXT ID:", db['NextID'])
    return db; 
  }

  function writeDatabase(req, res, data, completeWrite) {
    // TODO: decide what to put in the file to update it
    var db = createNewUser(req, data)
    fs.writeFile(DATABASE_FILENAME, JSON.stringify(db), err => {
      if (err) {
        console.log(err);
      } else {
        completeWrite();
      }
    });
  }


  //   document.getElementById('register').addEventListener('click', saveUserData);
  // });

  return router;
}();
