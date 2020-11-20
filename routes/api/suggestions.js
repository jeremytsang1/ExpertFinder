const {request} = require('express');
const express = require('express');
const router = express.Router();

// ----------------------------------------------------------------------------
// Helpers

// ----------------------------------------------------------------------------
// Routes

router.get('/', (req, res) => {
  var suggestions = {a: 1, b: 2, c: 3};

  res.send(JSON.stringify(suggestions))
});

// ----------------------------------------------------------------------------
// Exports

module.exports = router;
