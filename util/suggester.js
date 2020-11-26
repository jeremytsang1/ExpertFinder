class Suggester {
  constructor(fieldsToSuggestFor, db) {
    // TODO: Validate
    this.fieldsToSuggestFor = fieldsToSuggestFor;
    this.db = db;
  }

  makeSuggestions() {
    let suggestions = this.initializeEmptySuggestionsSets();
    this.addUserSuggestions(suggestions);
    this.addKnownSuggestions(suggestions);

    return this.convertSetsToArrays(suggestions);
  }

  initializeEmptySuggestionsSets() {
    let suggestions = {};
    this.fieldsToSuggestFor.forEach(field => suggestions[field] = new Set());
    return suggestions;
  }

  addUserSuggestions(suggestions) {
    let ary = null;
    let expertAry = this.db['Experts'];

    for (let expert of expertAry) {
      for (let field of this.fieldsToSuggestFor) {
        ary = expert[field];
        this.addAryEltsToSet(ary, suggestions[field]);
      }
    }
  }

  addKnownSuggestions(suggestions) {
    let ary = null;
    let known = this.db['Known'];

    for (let field of this.fieldsToSuggestFor) {
      ary = known[field];
      this.addAryEltsToSet(ary, suggestions[field]);
    }
  }

  addAryEltsToSet(ary, suggestionSet) {
    ary.forEach(elt => suggestionSet.add(elt));
  }

  convertSetsToArrays(suggestions) {
    return suggestions;
  }
}
