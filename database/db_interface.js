var test_db = require('./db')
const FuzzySearch = require('fuzzy-search')
const {Suggester} = require("./suggester");


function getExperts(search) {
    var keyword = search.keyword
    var results = []
    const searcher = new FuzzySearch(test_db.Experts, ['TechSkills', 'Coursework', 'Industry'], { caseSensitive: false }  )
    const result = searcher.search(keyword)
    
    //search expert courses and skills, and return expert json
    return result
}

function createExpert() {
    // name, TechSkills, Coursework, Industry, ContactInfo
    var new_id = test_db["Experts"].length + 1
    return new_id
}
function updateExperts(id, name, TechSkills, Coursework, Industry, ContactInfo) {
    return expert_id
}
function deleteExperts(expert_id) {
    return
}

function getSuggestions() {
    const suggester = new Suggester(['TechSkills', 'Coursework', 'Industry'], test_db);
    return suggester.makeSuggestions();
}


module.exports = {
    getExperts,
    createExpert,
    updateExperts,
    deleteExperts,
    getSuggestions
}
