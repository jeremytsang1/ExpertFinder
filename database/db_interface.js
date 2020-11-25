var test_db = require('./db')

function getExperts(search){
    var keyword = search.keyword
    var results = []
    for (var i=0; i < test_db["Experts"].length; i++){
        var expert = (test_db["Experts"][i])

        for (var tech_skill of expert.TechSkills){
            if (keyword == tech_skill){
                results.push(expert)
            }
        }
        for (var course of expert.Coursework){
            if (course.includes(keyword)){
                results.push(expert)
            }
        }
        
    }
    //search expert courses and skills, and return expert json
    return results
}

function createExpert(){
    // name, TechSkills, Coursework, Industry, ContactInfo
    var new_id = test_db["Experts"].length + 1
    return new_id
}
function updateExperts(id, name, TechSkills, Coursework, Industry, ContactInfo){
    return expert_id
}
function deleteExperts(expert_id){
    return 
}

module.exports = {
    getExperts,
    createExpert,
    updateExperts,
    deleteExperts
}
