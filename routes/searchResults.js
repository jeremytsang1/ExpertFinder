
module.exports = function(){
    var index = require('../index')
    var express = require('express')
    var router = express.Router();
    var db_interface = require('../database/db_interface')

    const fs = require('fs'); 

    // souce: https://www.geeksforgeeks.org/how-to-read-and-write-json-file-using-node-js/
    function getAllUsers(res, context, complete){
        fs.readFile("database/db.json", function(err, data) { 
            // Check for errors 
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            // Converting to JSON 
            const dbUsers = JSON.parse(data); 
            context.experts = dbUsers.Experts;
            complete();
        }); 
    }

    // This "get" route handler is not needed after search functionality is working
    // The purpose of this handler is to test the lay out and for test/debugging purposes
    // Use "post" route handler which will display the actual expert profiles based on search query
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.cssstyles = ["public/css/tagify.css"];
        context.jsscripts = ["jquery.js", "tagify.min.js", "SuggestedEditsForm.js", "getKeyword.js"] //add script names here to load in web page if needed
        
        //console.log(context)
        getAllUsers(res, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                // console.log("In get method");
                // console.log(context);
                res.render('searchResults', context)
            }
        }
    });

    router.post('/', function(req,res){
        var search_keyword = (req.body);
        console.log(search_keyword)
        var context = {};
        context.cssstyles = ["public/css/tagify.css"];
        context.jsscripts = ["jquery.js", "tagify.min.js", "SuggestedEditsForm.js", "getKeyword.js"] //add script names here to load in web page if needed
        
        context.experts = db_interface.getExperts(search_keyword);
        console.log(context)
            // res.send(context)
        res.set('Content-type', 'text/html')
        res.render('searchResults', context);
    })
    
    return router;
}();
