module.exports = function() {
  var express = require('express');
  var router = express.Router();
  var db_interface = require('../database/db_interface')

  router.post('/', function (req, res) {
    var search_keyword = (req.body);
    var context = {};
    context.jsscripts = ["jquery.js"]
    context.experts = db_interface.getExperts(search_keyword);
    console.log(context)
        // res.send(context)
    res.set('Content-type', 'text/html')
    res.render('searchResults', context);
  });

  return router;

}();
