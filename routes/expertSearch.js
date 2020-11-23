module.exports = function() {
var express = require('express');
var router = express.Router();
var db_interface = require('../database/db_interface')

router.post('/', function (req, res) {
  var search_keyword = (req.body)

  var context = {};
  context.experts = db_interface.getExperts(search_keyword)
  res.render('searchResults', context)
})
return router
}
