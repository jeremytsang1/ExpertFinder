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
    return result.filter(expert => expert.Active);
}

function getExpertCount() {
    return test_db.Experts.length;
}

function getExpertById(Id) {
    const experts = test_db.Experts;
    let results = experts.filter(expert => expert.Id === Id);
    switch (results.length) {
    case 0:
        return null;
    case 1:
        return results[0];
    default:
        throw new Error(`Multiple experts found with Id = ${Id}`);
    }
}

function activateExpert(Id) {
    getExpertById(Id).Active = true;
}

function getAllEmails() {
    return test_db.Experts.map(expert => expert.ContactInfo.Email);
}

function createExpert(name, TechSkills, Coursework, Industry, ContactInfo, ProfilePicture) {
    // name, TechSkills, Coursework, Industry, ContactInfo
    var new_id = test_db.Experts.length + 1
    const expert = {
        "Id": new_id,
        "Name": name,
        "TechSkills": TechSkills,
        "Coursework": Coursework,
        "Industry": Industry,
        "ContactInfo": ContactInfo,
        "ProfilePicture": ProfilePicture,
        "Active": false
    }
    test_db.Experts.push(expert);
    console.log("Experts after createExpert():\n",
                JSON.stringify(test_db.Experts, null, 2));
    return new_id
}

function updateExperts(Id, TechSkills, Coursework, Industry) {
    const expert = test_db.Experts.filter(expert => expert.Id === Id)[0];
    const incoming = {"TechSkills": TechSkills,
                      "Coursework": Coursework,
                      "Industry": Industry};

    // Use Sets to prevent duplicate values.
    for (let field in incoming) {
        let fieldSet = new Set(expert[field]);
        incoming[field].forEach(elt => fieldSet.add(elt));
        expert[field] = [...fieldSet].sort()
    }
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
    getExpertCount,
    getExpertById,
    activateExpert,
    getAllEmails,
    createExpert,
    updateExperts,
    deleteExperts,
    getSuggestions
}
