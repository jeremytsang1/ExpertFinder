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

  function runCallbacksAndRender(res, template, context, callbacks) {
    if (callbacks.length == 0) res.render(template, context); // render immediately
    else renderAfterCallbacksComplete(res, template, context, callbacks);
  }

  function renderAfterCallbacksComplete(res, template, context, callbacks) {
    let callbacksCompletedCount = 0;

    // run all the callbacks and render when they've all completed
    callbacks.forEach(callback => callback(complete))

    // ------------------------------------------------------------------------
    // Helper functions for renderAfterCallbacksComplete()

    // relies on closure for callbacksCompletedCount
    function complete() {
      callbacksCompletedCount++;
      // Check if callback is the last callback to complete
      if (callbacksCompletedCount == callbacks.length) res.render(template, context);
    }
  }

  function handleFailedDatabaseReadAttempt(res, err) {
    res.write(JSON.stringify(err));
    res.end();
  }

  function addExistingCategoryPropertiesToContext(context, jsonData) {
    const DB = JSON.parse(jsonData)
    const categories = [INDUSTRY, COURSEWORK, SKILLS];
    context[CATEGORIES] = {}

    categories.forEach(category => {
      context[CATEGORIES][category] = extractCategoryAryElts(DB[USERS], category)
    });
  }

  function extractCategoryAryElts(users, category) {
    extracted = new Set();
    users.forEach(user => user[category].forEach(elt => extracted.add(elt)));
    return [...extracted];  // Use array since `Set` doesn't work with JSON
  }

  router.get('/', function(req, res) {
    var context = {
      cssstyles: [
        "public/css/tagify.css"
      ],
      jsscripts: [
        "public/scripts/tagify.min.js",
        "public/scripts/profileCreationTags.js"
      ]
    };

    // all elements must have `complete` as parameter as the last callback to
    // complete will be the one responsible for rendering the template.
    const CALLBACKS = [readDatabase];

    runCallbacksAndRender(res, 'createProfile', context, CALLBACKS);

    // ------------------------------------------------------------------------
    // Callback helpers for router.get('/').
    function readDatabase(complete) {
      fs.readFile(DATABASE_FILENAME, (err, data) => {
        if (err) handleFailedDatabaseReadAttempt(res, err)
        else addExistingCategoryPropertiesToContext(context, data)
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
