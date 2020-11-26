const {request} = require('express');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const {Callback} = require('../util/callback'); // Destructure for brevity.
const Suggester = require('../util/suggester');
const SuggestionValidator = require('../util/suggestionValidator');


// ----------------------------------------------------------------------------
// Constants
const DB_INTERFACE = require('./database/db_interface');
const DATABASE_FILENAME = 'database/db.json';
const SUGGESTION_FIELDS = ['Industry', 'TechSkills', 'Coursework'];

// ----------------------------------------------------------------------------
// Error handler

function handleError(err, res, messageToSendToClient) {
  console.log(err);
  res.status(500).contentType("text/plain").end(messageToSendToClient);
}

// ----------------------------------------------------------------------------
// Routes

router.get('/', (req, res) => {
  let context = {"Categories": null};
  let database = null; // take advantage of closure

  // all elements must have `complete` as parameter as the last callback to
  // complete will be the one responsible for rendering the template.
  const CALLBACKS = [new Callback(readDatabase, sentContextAsJSON)];

  Callback.runCallbacks(CALLBACKS)

  // --------------------------------------------------------------------------
  // Callback helpers for router.get('/')

  function readDatabase(complete, actionIfLastCallback) {
    fs.readFile(DATABASE_FILENAME, (err, data) => {
      if (err) handleError(err, res, "fs.readFile() failed to read the JSON file!");
      else handleProperlyFormattedDatabase(data);
    });

    // Needs to be a nested function to make sure parameter `complete()` gets
    // passed `actionIfLastCallback`.
    function handleProperlyFormattedDatabase(data) {
      database = JSON.parse(data);
      let validationMsg = validateDatabaseBeforeSuggestions();

      if (validationMsg !== null) handleError(new Error(validationMsg), res, validationMsg);
      else {
        addSuggestionsToContext();
        complete(actionIfLastCallback);
      }
    }
  }

  function validateDatabaseBeforeSuggestions() {
    const validator = new SuggestionValidator.Validator(SUGGESTION_FIELDS, database);
    let validationMsg = validator.isDatabaseSafeForSuggestions();
    return validationMsg;
  }

  function addSuggestionsToContext() {
    let suggester = new Suggester.Suggester(SUGGESTION_FIELDS, database);
    context["Categories"] =  suggester.makeSuggestions();
  }

  function sentContextAsJSON() {
    res.send(JSON.stringify(context));
  }
});

// ----------------------------------------------------------------------------
// Exports

module.exports = router;
