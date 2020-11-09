var submitButton = document.getElementById("submit-search-button")
submitButton.addEventListener("click", (event) => searchSubmit(event), false)

function searchSubmit(event) {
    event.preventDefault();

    var req = new XMLHttpRequest();
    var payload = {keyword:null};

    payload.keyword = document.getElementById("search-input").value;
    
    req.open('POST', 'http://localhost:3500/api/experts', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
            console.log("request was made!");
            var response = (req.response)
            var responseJSON = JSON.parse(req.response)
            console.log(responseJSON)
            
            var userName;
            var userCourses = [];
            var userCategories = [];
            var userGithub;
            var userResult; 

            if (response != "search inconclusive"){
                for (var user in responseJSON){
                    userName = responseJSON[user].expert_name
                    var courseArray = responseJSON[user].expert_course
                    var categoriesArray = responseJSON[user].expert_categories

                    categoriesArray.forEach(category => {
                        userCategories.push(JSON.stringify(category))
                    });
                    
                    courseArray.forEach(course => {
                        userCourses.push(JSON.stringify(course))
                    });
                    
                    userGithub = responseJSON[user].expert_github

                    userResult = [userName, (userCourses), userCategories, userGithub]
                    console.log(userResult)

                }
                var display_response = document.getElementById('search-results')
                display_response.innerText = userResult 
            }
            
        } else {
            console.log("Error in network request: " + req.statusText);
        }
    })
    req.send(JSON.stringify(payload));
    
    
    };