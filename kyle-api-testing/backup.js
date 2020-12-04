
module.exports = function(){
    var index = require('../index')
    var express = require('express')
    var router = express.Router();
    var db_interface = require('../database/db_interface')
    var {addReadonlyTags} = require('../util/readonlyTags');

    const fetch = require('node-fetch');
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

         // --------------------------------------------
        //  Kyle's code to load in github data   
        // SOURCE: started with some code from https://www.youtube.com/watch?v=5QlE6o-iYcE then added onto it
        git()

        async function git() {

            const url = "https://api.github.com/users/" + user + "/repos"
            const response = await fetch(url)
            const result = await response.json()



            // console.log(context.experts[0]["ContactInfo"]["Github"].slice(11))

            for (x = 0; x < context.experts.length; x ++) {

                console.log()
                console.log()
                console.log()
                console.log()
                // const url = "https://api.github.com/users/" + user + "/repos"
                // const response = await fetch(url)
                // const result = await response.json()

                var user  = context.experts[x]["ContactInfo"]["Github"].slice(11)
                // console.log(user)

                const url = "https://api.github.com/users/" + user + "/repos"
                const response = await fetch(url)
                const result = await response.json()

                var repoList = []
                        
                if (result.length < 6) {
                    for (i = 0; i < result.length; i++) {
                        repoList.push(result[i].html_url)
                    }
                }

                else {
                    for (i = 0; i < 5; i++) {
                repoList.push(result[i].html_url)
                    }
                }

                console.log(user, repoList)

                context.experts[x]["Repos"] = repoList   

                // console.log(context.experts[x])
                callbackCount++;

                complete()
            }
        }
        // ------------------------------------------



        function complete(){
            callbackCount++;

            if(callbackCount >= (context.experts.length)){

                // console.log("In get method");
                // console.log(context);
                res.render('searchResults', context)
            }
        }
    });

    router.post('/', function(req,res){
        var callbackCount = 0;

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

        git()

        async function git() {

            const url = "https://api.github.com/users/" + user + "/repos"
            const response = await fetch(url)
            const result = await response.json()



            // console.log(context.experts[0]["ContactInfo"]["Github"].slice(11))

            for (x = 0; x < context.experts.length; x ++) {

                console.log()
                console.log()
                console.log()
                console.log()
                // const url = "https://api.github.com/users/" + user + "/repos"
                // const response = await fetch(url)
                // const result = await response.json()

                var user  = context.experts[x]["ContactInfo"]["Github"].slice(11)
                // console.log(user)

                const url = "https://api.github.com/users/" + user + "/repos"
                const response = await fetch(url)
                const result = await response.json()

                var repoList = []
                        
                if (result.length < 6) {
                    for (i = 0; i < result.length; i++) {
                        repoList.push(result[i].html_url)
                    }
                }

                else {
                    for (i = 0; i < 5; i++) {
                repoList.push(result[i].html_url)
                    }
                }

                console.log(user, repoList)

                context.experts[x]["Repos"] = repoList   

                // console.log(context.experts[x])
                // callbackCount++;

            }

        }


        // ------------------------------------------






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
        res.render('searchResults', context);
    })
    
    function userInfoUpdate(context, experts, keyword){
        expertInfo.Id = createExpert();
       //prevents duplicates hopefully
        JSON.parse(expert) 
        let expertUpdateSet = new Set(expert);
        expertUpdateSet.add("TechSkills")
        expertUpdateSet.add("Coursework")
        expertUpdateSet.add("Industry")
        test_db.Experts.push(expertUpdateSet);
    }
        
    

    function addSuggestedEditsContext(context, experts, keyword) {
        // prevent edits from deleting existing skills, coursework, industries
        experts.map(expert => addReadonlyTags(expert));
        // allows modal to re-display search
        context.keyword = keyword;
    }

    return router;
}();
