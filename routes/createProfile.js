module.exports = function() {
  var express = require('express');
  var router = express.Router();
  const fs = require('fs');
  const DATABASE_FILENAME = 'db.json';
  const INDUSTRY = 'Industry';
  const COURSEWORK = 'Coursework';
  const SKILLS = 'TechSkills';
  const USERS = 'Users';
  const CATEGORIES = 'Categories';

  function renderAfterCallbacksComplete(res, template, context, callbacks) {
    let callbacksCompletedCount = 0;

    // relies on closure for callbacksCompletedCount
    function complete() {
      callbacksCompletedCount++;
      if (callbacksCompletedCount == callbacks.length) {
        res.render(template, context);
      }
    }

    // run all the callbacks and render when they've all completed
    callbacks.forEach(callback => callback(complete))
  }

  function handleFailedDatabaseReadAttempt(res, err) {
    res.write(JSON.stringify(err));
    res.end();
  }

  function addSkillsAndCourseWorkToContext(context, jsonData) {
    // TODO: store the skills and coursework inside `context`
  }

  router.get('/', function(req, res) {
    var context = {
      cssstyles: [
        "public/css/tagify.css"
      ],
      jsscripts: [
        "public/scripts/tagify.min.js",
        "public/scripts/skillCourseworkTags.js"
      ]
    };

    // all elements must have `complete` as parameter as the last callback to
    // complete will be the one responsible for rendering the template.
    const CALLBACKS = [readDatabase];

    renderAfterCallbacksComplete(res, 'createProfile', context, CALLBACKS);

    // ------------------------------------------------------------------------
    // Callback helpers for router.get('/').
    function readDatabase(complete) {
      fs.readFile(DATABASE_FILENAME, (err, data) => {
        if (err) handleFailedDatabaseReadAttempt(res, err)
        else addSkillsAndCourseWorkToContext(context, data)
        complete();
      });
    }
    // ------------------------------------------------------------------------
  });
     
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
    res.render('createProfile', context);
  });

  //   document.getElementById('register').addEventListener('click', saveUserData);
  // });

  return router;
}();
