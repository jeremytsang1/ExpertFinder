const {request} = require('express');
const express = require('express');
const router = express.Router();
const fs = require('fs');

// ----------------------------------------------------------------------------
// Constants

const DB_INTERFACE = require('../database/db_interface');

// ----------------------------------------------------------------------------
// Error handler

function handleError(err, res, messageToSendToClient) {
  console.log(err);
  res.status(500).contentType("text/plain").end(messageToSendToClient);
}

// ----------------------------------------------------------------------------
// Routes

// Use to send suggestions to the client to use as tags.
router.get('/', (req, res) => {
  let context = {"Categories": DB_INTERFACE.getSuggestions()};
  const MSG = context.Categories.message;

  if (!context.Categories.success) handleError(new Error(MSG), res, MSG);
  else res.send(JSON.stringify(context));
});

// ----------------------------------------------------------------------------
// Exports

module.exports = router;
