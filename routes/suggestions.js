const {request} = require('express');
const express = require('express');
const router = express.Router();

// ----------------------------------------------------------------------------
// Constants

const dbInterface = require('../database/db_interface');

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
  let context = {"Categories": dbInterface.getSuggestions()};
  const message = context.Categories.message;

  if (!context.Categories.success) handleError(new Error(message), res, message);
  else res.send(JSON.stringify(context));
});

// ----------------------------------------------------------------------------
// Exports

module.exports = router;
