var submitButton = document.getElementById("submit-search-button")
submitButton.addEventListener("click", (event) => searchSubmit(event), false)

function searchSubmit(event) {
    event.preventDefault();

    var req = new XMLHttpRequest();
    var payload = {keyword:null};

    payload.keyword = document.getElementById("search-input").value;
    console.log(payload)
    req.open('POST', 'http://localhost:3500/expertSearch', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
            console.log("request was made!");
            
        } else {
            console.log("Error in network request: " + req.statusText);
        }
    })
    req.send(JSON.stringify(payload));
    
    
    };