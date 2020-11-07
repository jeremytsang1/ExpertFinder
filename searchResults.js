module.exports = function(){

    var express = require('express');
    var router = express.Router();
    const fs = require('fs'); 

    // function getClasses(res, mysql, context, complete){
    //     var sql =  "SELECT c.ClassID, c.ClassDepartment, c.ClassNumber, c.Section, c.ClassDate, c.ClassTime, c.TeacherID FROM Classes c";
    //     mysql.pool.query(sql, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.classes = results;
    //         complete();
    //     });
    // }

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
            //console.log(users.users[0].name)
            context.users = dbUsers.users;
        }); 
        complete();
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

    // function getClubs(res, mysql, context, complete){
    //     var sql =  "SELECT c.ClubID, c.ClubName, c.Category, c.ClubDate, c.ClubTime, c.Sponsor, c.Funding, c.Sponsor FROM Clubs c";
    //     mysql.pool.query(sql, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.clubs = results;
    //         complete();
    //     });
    // }

    // function getClass(res, mysql, context, classId, complete){
    //     var sql = "SELECT c.ClassID, c.TeacherID, c.ClassDepartment, c.ClassNumber, c.Section, c.ClassDate, c.ClassTime FROM Classes c \
    //                WHERE c.ClassID = ?";
    //     var inserts = [classId];
    //     mysql.pool.query(sql, inserts, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.class = results[0];
    //         complete();
    //     });
    // }

    // function getClub(res, mysql, context, clubId, complete){
    //     var sql = "SELECT c.ClubID, c.ClubName, c.Category, c.ClubDate, c.ClubTime, c.Sponsor, c.Funding FROM Clubs c \
    //                WHERE c.ClubID = ?";
    //     var inserts = [clubId];
    //     mysql.pool.query(sql, inserts, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.club = results[0];
    //         complete();
    //     });
    // }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
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
    
    return router;
}();
