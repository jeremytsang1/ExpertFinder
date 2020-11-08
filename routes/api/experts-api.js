const { request } = require('express');
var express = require('express');
var router = express.Router();
var test_db = require('./test_db')


router.post('/experts',function(req,res){
    
    var request_body= (req.body)
    var search_key = JSON.stringify(request_body.keyword)
    // console.log(search_key)
    // console.log(test_db)
    // for each user in the database
    for (var users in test_db){
        // console.log(test_db[users])
        //for details in user
        for (var id in test_db[users]){
            // console.log(test_db[users][id])
            for (var details in test_db[users][id])
                // console.log(test_db[users][id][details])
                for (var c in test_db[users][id][details]['expert_course']){
                    for (var i in test_db[users][id][details]['expert_course'][c]){
                        var key = JSON.stringify(i)
                        var value = JSON.stringify(test_db[users][id][details]['expert_course'][c][i])
                        console.log(key, value, search_key)
                    }
                    if (key.includes(search_key) == true){
                        console.log("found it!")
                        res.send(test_db[users][id])
                    
                    } else if (value.includes(search_key) == true) {
                        console.log("found it!")
                        res.send(test_db[users][id])
                    } else {
                        console.log("search inconclusive")
                    }
                      
                    }
                }
        }
                // Object.keys(courses).forEach(c => {
                //     // if the keyword matches the course history
                //     // console.log(courses[c]);
                //     if (courses[c].includes(search_key)){
                //         // send the user JSON 
                //         console.log(search_key, test_db[user_id] )
                //         res.send(test_db[user_id])
                //     }
                // });
                // if the keyword doesn't match the course history, check the categories
    //         } else if (test_db[user_id][detail] == 'expert_categories'){
    //             var categories = test_db[user_id][detail]
    //             Object.keys(categories).forEach(c => {
    //                 console.log(categories[c]);
    //                 // if the keyword matches the category
    //                 if (categories[c].includes(search_key)){
    //                     // send the user JSON
    //                     console.log(search_key, test_db[user_id] )
    //                     res.send(test_db[user_id])
    //                 }
    //             });
    //         } else {
    //             res.send('No experts match your search keyword')
            
      
    
})

module.exports = router;
