var test_db = require('./db')
const FuzzySearch = require('fuzzy-search')
const {Suggester} = require("./suggester");
const {SuggestionValidator} = require("./suggestionValidator");

function getExperts(search) {
    var keyword = search.keyword
    var results = []
    const searcher = new FuzzySearch(test_db.Experts, ['TechSkills', 'Coursework', 'Industry'], { caseSensitive: false }  )
    const result = searcher.search(keyword)
    
    //search expert courses and skills, and return expert json
    return result
}

function createExpert(name, TechSkills, Coursework, Industry, ContactInfo, ProfilePicture) {
    // name, TechSkills, Coursework, Industry, ContactInfo
    var new_id = test_db["Experts"].length + 1
    const expert = {
        "Id": new_id,
        "Name": name,
        "TechSkills": TechSkills,
        "Coursework": Coursework,
        "Industry": Industry,
        "ContactInfo": ContactInfo,
        "ProfilePicture": ProfilePicture
    }
    test_db["Experts"].push(expert);
    return new_id
}
function updateExperts(id, name, TechSkills, Coursework, Industry, ContactInfo) {
    return expert_id
}
function deleteExperts(expert_id) {
    return
}

function getSuggestions() {
    const FIELDS = ['TechSkills', 'Coursework', 'Industry'];
    const MSG = (new SuggestionValidator(FIELDS, test_db)).isDatabaseSafeForSuggestions();
    if (MSG !== null) return {'success': false, 'message': MSG};

    const SUGGESTER = new Suggester(FIELDS, test_db);
    return {'success': true, ...SUGGESTER.makeSuggestions()};
}


module.exports = {
    getExperts,
    createExpert,
    updateExperts,
    deleteExperts,
    getSuggestions
}
