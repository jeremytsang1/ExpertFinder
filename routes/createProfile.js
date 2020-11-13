module.exports = function() {
  let express = require('express');
  let router = express.Router();



  router.get('/', function(req, res) {
    res.render('createProfile');
  });
    
  router.post('/', function(req, res) {
    var qParams = [];
    for (var p in req.body) {
        qParams.push(JSON.stringify({'first-name':p, 'value':req.body[p]}))
    }
    console.log(qParams);
    console.log(req.body);
    console.log("PPPPPOOOOOOOSSSSSTTT");
    var context = {};
    context.dataList = qParams;
    res.render('createProfile', context);
  });

  //   document.getElementById('register').addEventListener('click', saveUserData);
  // });

  return router;
}();
