const {request} = require('express');
const express = require('express');
const router = express.Router();
const DATABASE_FILENAME = 'database/db.json';
const fs = require('fs');
const callbackUtil = require('../../util/callbackUtil');
const suggestionUtil = require('../../util/suggestionCategory');

// ----------------------------------------------------------------------------
// Routes

router.get('/', (req, res) => {
  let context = suggestionUtil.SuggestionCategory.prepareContext();

  const categories = [
    new suggestionUtil.SuggestionCategory('Industry', elt => elt),
    new suggestionUtil.SuggestionCategory('TechSkills', elt => elt),
    new suggestionUtil.SuggestionCategory('Coursework', elt => {
      const NUM = "course_num";
      const NAME = "course_name";
      return `${elt[NUM]} ${elt[NAME]}`;
    })
  ];

  // all elements must have `complete` as parameter as the last callback to
  // complete will be the one responsible for rendering the template.
  const CALLBACKS = [readDatabase];

  callbackUtil.runCallbacksAndSend(res, context, CALLBACKS)

  // --------------------------------------------------------------------------
  // Callback helpers for router.get('/')

  function readDatabase(complete) {
    fs.readFile(DATABASE_FILENAME, (err, data) => {
      if (err) handleFailedDatabaseReadAttempt(res, err)
      else categories.forEach(cat => cat.addSuggestionsToContext(context, data))
      complete();
    });
  }
});

// ----------------------------------------------------------------------------
// Exports

module.exports = router;
