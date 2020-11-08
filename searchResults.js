module.exports = function(){

    var express = require('express');
    var router = express.Router();
    const fs = require('fs'); 

    // souce: https://www.geeksforgeeks.org/how-to-read-and-write-json-file-using-node-js/
    function getAllUsers(res, context, complete){
        // Read db.json file 
        fs.readFile("db.json", function(err, data) { 
            // Check for errors 
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            // Converting to JSON 
            const dbUsers = JSON.parse(data); 
            //console.log(users); // Print users  
            context.users = dbUsers.users;
            console.log("In function getAllUsers. Printing context")
            console.log(context)
            complete();
        }); 
        // const db_users = require('./db.json');
        // console.log(db_users);
    }


    function getContactInfoById(res, context, id, complete){
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
        });

        // search all users to match ID. if a match then save the contact information

        complete();    
    }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["getContactInfo.js"];
        console.log(context)
        getAllUsers(res, context, complete);
        // context.jsscripts = ["deleteClass.js","deleteClub.js","updateClub.js", "updateClass.js"];
        // var mysql = req.app.get('mysql');
        // getClasses(res, mysql, context, complete);
        // getClubs(res, mysql, context, complete);

        // force syncronous flow (make sre getUsers() function finishes executing before proceedding to next line of of code)
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log("In get method");
                console.log(context);
                res.render('searchResults', context)
            }
        }
    });

    // Display contact info for specific user ID
    router.get('/:id/contactInfo', function(req, res){
        console.log("inside router.get(searchResults/:id/contactInfo)")
        var callbackCount = 0;
        var context = {};
        getContactInfoById(res, context, id, complete)

        // force syncronous flow (make sre getUsers() function finishes executing before proceedding to next line of of code)
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log("In get method");
                console.log(context);
                res.render('searchResults', context)
            }
        }
    });
    
    return router;
}();
