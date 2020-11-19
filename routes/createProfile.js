module.exports = function() {
  let express = require('express');
  let router = express.Router();


 

  router.get('/', function(req, res) {
    res.render('createProfile');
  });
     
  router.post('/', function(req, res) {
    var qParams = [];
    // for (var p in req.body) {
        // qParams.push(JSON.stringify({'first-name':p, 'value':req.body[p]}))
    // }
    // console.log(qParams);

     // writing to a file code is based on https://stackabuse.com/writing-to-files-in-node-js/
    const fs = require('fs');

    let newProfile = 'line1\n' + 
                'line2\n' + 
                'line3';

    // write to a new file named 2pac.txt
    fs.writeFile('testDB.json', newProfile, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log('profile saved!');
    });

    
    console.log(req.body);
    console.log("PPPPPOOOOOOOSSSSSTTT");
    var context = {};
    // context.dataList = qParams;
    res.render('createProfile', context);
  });

  //   document.getElementById('register').addEventListener('click', saveUserData);
  // });

  return router;
}();
