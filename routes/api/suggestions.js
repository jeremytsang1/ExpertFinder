const {request} = require('express');
const express = require('express');
const router = express.Router();
const DATABASE_FILENAME = 'db.json';
const fs = require('fs');

// ----------------------------------------------------------------------------
// Helpers

// ----------------------------------------------------------------------------
// Routes

router.get('/', (req, res) => {
  var context = {a: 1, b: 2, c: 3};

  // all elements must have `complete` as parameter as the last callback to
  // complete will be the one responsible for rendering the template.
  const CALLBACKS = [readDatabase];

  res.send(JSON.stringify(context));

  // --------------------------------------------------------------------------
  // Callback helpers for router.get('/')

  function readDatabase(complete) {
    fs.readFile(DATABASE_FILENAME, (err, data) => {
      if (err) handleFailedDatabaseReadAttempt(res, err)
      else addExistingCategoryPropertiesToContext(context, data)
      complete();
    });
  }
});

// ----------------------------------------------------------------------------
// Exports

module.exports = router;
