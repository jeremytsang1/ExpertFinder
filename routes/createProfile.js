module.exports = function() {
  var express = require('express');
  var router = express.Router();

  router.get('/', function(req, res) {
    var context = {
      cssstyles: [
        "public/css/tagify.css"
      ],
      jsscripts: [
        "profileCreationDatabaseField.js",
        "profileCreationStructure.js",
        "tagify.min.js",
        "profileCreationTags.js",
        "profileCreationForm.js"
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
    // for (var p in req.body) {
        // qParams.push(JSON.stringify({'first-name':p, 'value':req.body[p]}))
    // }
    // console.log(qParams);

     // writing to a file code is based on https://stackabuse.com/writing-to-files-in-node-js/
    const fs = require('fs');

    var newProfile = JSON.stringify(req.body);

    // write to a new file
    fs.appendFile('testDB.json', newProfile, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log('profile saved!');
    });

    
    console.log(req.body);
    console.log("PPPPPOOOOOOOSSSSSTTT");
    var context = {};
    // context.dataList = qParams;
    res.redirect(`createProfile/success?email=${req.body.email}`);
    res.end();
  });

  //   document.getElementById('register').addEventListener('click', saveUserData);
  // });

  return router;
}();
