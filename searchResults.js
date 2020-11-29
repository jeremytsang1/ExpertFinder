
module.exports = function(){
    var index = require('./index')
    var express = require('express')
    var router = express.Router();
    var db_interface = require('./database/db_interface')

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


    //FIXME function not in us at the moment. Needs to be completed for potential future use
    function getUserById(res, context, id, complete){
        callbackCount2 = 0;
        allUsers = {}
        // Read db.json file 
        fs.readFile("db.json", function(err, data) { 
            // Check for errors 
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            // Converting to JSON 
            const dbUsers = JSON.parse(data); 
            allUsers = dbUsers.users;
            complete2()
        });

        // force syncronous flow (make sre getUsers() function finishes executing before proceedding to next line of of code)
        function complete2(){
            callbackCount2++;
            if(callbackCount2 >= 1){
                 // search all users to match ID. if a match then save the contact information
                // console.log("Inside getuserById in callbackCount2");
                // console.log(allUsers)
                // FIXME add alrorithm here to return user info based on ID
                complete();    
            }
        }
    }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.cssstyles = ["public/css/tagify.css];
        context.jsscripts = ["jquery.js", "tagify.min.js", "SuggestEditsForm.js"] //add script names here to load in web page if needed
        
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
        context.jsscripts = ["jquery.js"]
        context.experts = db_interface.getExperts(search_keyword);
        console.log(context)
            // res.send(context)
        res.set('Content-type', 'text/html')
        res.render('searchResults', context);
    })
    
    return router;
}();
