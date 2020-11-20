const {request} = require('express');
const express = require('express');
const router = express.Router();
const DATABASE_FILENAME = 'db.json';
const fs = require('fs');
const callbackUtil = require('../../util/callbackUtil');

// User Specific Constants
const INDUSTRY = 'Industry';
const COURSEWORK = 'Coursework';
const SKILLS = 'TechSkills';
const USERS = 'Users';
const CATEGORIES = 'Categories';
const KNOWN = 'Known';

// ----------------------------------------------------------------------------
// Helpers

function handleFailedDatabaseReadAttempt(res, err) {
  res.write(JSON.stringify(err));
  res.end();
}

function addExistingCategoryPropertiesToContext(context, jsonData) {
  const DB = JSON.parse(jsonData)
  const categories = [INDUSTRY, COURSEWORK, SKILLS];
  context[CATEGORIES] = {}

  categories.forEach(category => {
    context[CATEGORIES][category] = extractCategoryAryElts(DB, category)
  });
}

function extractCategoryAryElts(DB, category) {
  extracted = new Set();
  users = DB[USERS]
  users.forEach(user => user[category].forEach(elt => extracted.add(elt)));
  addPreexistingSuggestions(DB, category, extracted);
  return [...extracted];  // Use array since `Set` doesn't work with JSON
}

function addPreexistingSuggestions(DB, category, extracted) {
  if (DB[KNOWN] !== undefined) {
    DB[KNOWN][category].forEach(suggestion => extracted.add(suggestion));
  }
}


// ----------------------------------------------------------------------------
// Routes

router.get('/', (req, res) => {
  var context = {};

  // all elements must have `complete` as parameter as the last callback to
  // complete will be the one responsible for rendering the template.
  const CALLBACKS = [readDatabase];

  callbackUtil.runCallbacksAndSend(res, context, CALLBACKS)

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
