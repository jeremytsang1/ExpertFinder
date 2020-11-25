const {request} = require('express');
const express = require('express');
const router = express.Router();
const DATABASE_FILENAME = 'database/db.json';
const fs = require('fs');
const suggestionUtil = require('../util/suggestionCategory');
const {Callback} = require('../util/callback');
const Validator = require('../util/suggestionValidator');
const SUGGESTION_FIELDS = ['Industry', 'TechSkills', 'Coursework']


function handleError(err, res, msg) {
  console.log(err);
  res.status(500).contentType("text/plain").end(msg);
}

// ----------------------------------------------------------------------------
// Routes

router.get('/', (req, res) => {
  let context = suggestionUtil.SuggestionCategory.prepareContext();

  const categories = [
    new suggestionUtil.SuggestionCategory('Industry', elt => elt),
    new suggestionUtil.SuggestionCategory('TechSkills', elt => elt),
    new suggestionUtil.SuggestionCategory('Coursework', elt => elt)
  ];

  // all elements must have `complete` as parameter as the last callback to
  // complete will be the one responsible for rendering the template.
  const CALLBACKS = [new Callback(readDatabase, sentContextAsJSON)];

  Callback.runCallbacks(CALLBACKS)

  // --------------------------------------------------------------------------
  // Callback helpers for router.get('/')

  function readDatabase(complete, actionIfLastCallback) {
    fs.readFile(DATABASE_FILENAME, (err, data) => {
      if (err) handleError(err, res, "Failed to read database!")
      else {
        try {handleProperlyFormattedDatabase(data)}
        catch (formattingError) {handleError(formattingError, res,
                                             "Database not properly formatted!");}
      }
    });

    function handleProperlyFormattedDatabase(data) {
      const validator = new Validator.SuggestionValidator(SUGGESTION_FIELDS, JSON.parse(data));
      validator.isDatabaseSafeForSuggestions()
      categories.forEach(cat => cat.addSuggestionsToContext(context, data))
      complete(actionIfLastCallback);
    }
  }

  function sentContextAsJSON() {
    res.send(JSON.stringify(context));
  }
});

// ----------------------------------------------------------------------------
// Exports

module.exports = router;
