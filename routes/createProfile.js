module.exports = function() {
  var express = require('express');
  var router = express.Router();

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

    res.render('createProfile', context);

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
