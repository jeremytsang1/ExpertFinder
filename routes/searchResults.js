
module.exports = function(){
    var index = require('../index')
    var express = require('express')
    var router = express.Router();
    var db_interface = require('../database/db_interface')
    var {addReadonlyTags} = require('../util/readonlyTags');

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

        console.log(context)
        context.cssstyles = ["public/css/tagify.css"];
        context.jsscripts = ["jquery.js",
                             "tagify.min.js",
                             "tagifyClientRequest.js",
                             "SuggestedEditsForm.js",
                             "getKeyword.js"];
        var experts = db_interface.getExperts(search_keyword);
        context.experts = experts;
        addSuggestedEditsContext(context, experts, search_keyword.keyword);
            // res.send(context)
        res.set('Content-type', 'text/html')
        res.render('searchResults', context);
    })
    
     router.post('/', function(req,res){
        var search_keyword = (req.body);
        console.log(search_keyword)
        var context = {};

        console.log(context)
        context.cssstyles = ["public/css/tagify.css"];
        context.jsscripts = ["jquery.js",
                             "tagify.min.js",
                             "tagifyClientRequest.js",
                             "SuggestedEditsForm.js",
                             "getKeyword.js"];
        var experts = db_interface.getExperts(search_keyword);
        context.experts = experts;
        userInfoUpdate(context, experts, search_keyword.keyword);
        addSuggestedEditsContext(context, experts, search_keyword.keyword);
            // res.send(context)
        res.set('Content-type', 'text/html')
        res.render('searchResults/update', context);
    })
    
    function userInfoUpdate(context, experts, keyword){
        expertInfo.Id = createExpert();
       //prevents duplicates hopefully
        JSON.parse(expert) 
        let expertUpdateSet = new Set(expert);
        expertUpdateSet.add("TechSkills")
        expertUpdateSet.add("Coursework")
        expertUpdateSet.add("Industry")
        test_db.Experts.push(expert);
    }
        
    }

    function addSuggestedEditsContext(context, experts, keyword) {
        // prevent edits from deleting existing skills, coursework, industries
        experts.map(expert => addReadonlyTags(expert));
        // allows modal to re-display search
        context.keyword = keyword;
    }

    return router;
}();
